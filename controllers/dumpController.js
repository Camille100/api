/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import Dump from '../models/dumpModel.js';
import Notification from '../models/notificationModel.js';
import { sendNotification, sendNotificationToAdmin } from './notificationController.js';
import { addXp } from './userController.js';

dotenv.config();

export const addDump = async (req, res) => {
  if (!req.body.comment || typeof req.body.comment !== 'string')
    return res.status(400).json({ error: 'Must be a string' });
  if (
    !req.body.coordinates ||
    typeof req.body.coordinates.longitude !== 'number' ||
    typeof req.body.coordinates.latitude !== 'number'
  ) {
    return res.status(400).json({ error: 'Missing coordinates' });
  }

  const equipmentArr = [];
  if (req.body.equipment && req.body.equipment.length > 0) {
    req.body.equipment.forEach((equipment) => {
      if (equipment.id) {
        equipmentArr.push(equipment.id);
      }
    });
  }
  const dump = new Dump({
    creator: req.body.creator,
    comment: req.body.comment,
    status: 'open',
    equipments: equipmentArr,
    accessible: {
      ...req.body.accessible,
    },
    pictures: req.body.pictures,
    location: {
      type: 'Point',
      coordinates: [
        req.body.coordinates.longitude,
        req.body.coordinates.latitude,
      ],
    },
  });

  dump.save()
    .then((response) => {
      addXp(50, req.body.creator);
      return res.status(201).json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

export const getDump = async (req, res) => {
  Dump.findOne({ _id: req.params.dumpId })
    .populate([
      {
        path: 'equipments',
        select: 'name',
      },
    ])
    .lean()
    .exec((err, dump) => {
      if (err) return res.status(400).json(err);
      else if (dump === null) {
        return res.status(400).json({ error: 'No dump found' });
      } else {
        return res.status(200).json(dump);
      }
    });
};

export const getDumpsByUser = async (req, res) => {
  Dump.find({ $or: [{ creator: req.params.userId }, { cleaner: req.params.userId }, { "cleaningDemand.cleaner": req.params.userId }] })
    .populate([
      {
        path: 'equipments',
        select: 'name',
      },
    ])
    .lean()
    .exec((err, dumps) => {
      if (err) return res.status(400).json(err);
      else if (dumps.length === 0) {
        return res.status(400).json({ error: 'No dump found' });
      } else {
        const cleanedDumps = [];
        const signaledDumps = [];
        dumps.forEach((dump) => {
          if (dump.creator.toString() === req.params.userId.toString()) {
            signaledDumps.push(dump);
          } else if (dump.cleaner && dump.cleaner.toString() === req.params.userId.toString()) {
            cleanedDumps.push(dump);
          }
          if (dump.cleaningDemands && dump.cleaningDemands.length > 0) {
            dump.cleaningDemands.forEach((demand) => {
              if (demand.cleaner.toString() === req.params.userId.toString()) {
                cleanedDumps.push(dump);
              }
            })
          }
        })
        const dumpsObj = {
          signaledDumps: signaledDumps,
          cleanedDumps: cleanedDumps
        }
        return res.status(200).json(dumpsObj);
      }
    });
};

export const getDumps = (req, res) => {
  Dump.find()
    .populate([
      {
        path: 'equipments',
        select: 'name',
      },
    ])
    .lean()
    .exec((err, dumps) => {
      if (err) return res.status(400).json(err);
      else if (dumps.length === 0) {
        return res.status(400).json({ error: 'No dumps found' });
      } else {
        return res.status(200).json(dumps);
      }
    });
};

export const updateDump = (req, res) => {
  Dump.updateOne(
    { _id: req.body.dumpId },
    { $set: { ...req.body.dumpData } }
  ).exec((err, updated) => {
    if (err) return res.status(400).json(err);
    else {
      return res.status(200).json({ message: 'Dump updated' });
    }
  });
};

export const addCleaningDemand = (req, res) => {
  if (req.body.dumpId === undefined || req.body.cleaningDemand === undefined) {
    return res.status(400).json({ error: "missing parameters" });
  }
  if ( typeof req.body.cleaningDemand !== 'object' || typeof req.body.dumpId !== 'string') {
    return res.status(400).json({ error: "invalid parameters" });
  }

  Dump.findOneAndUpdate(
    {
      $and: [
        {
          _id: req.body.dumpId
        },
        {
          "status": "open"
        }
      ]
    },
    {
      $push: { cleaningDemands: req.body.cleaningDemand },
      $set: { status: 'waiting' }
    },
    { new: true }
  ).exec((err, updated) => {
    if (err) return res.status(400).json(err);
    if (updated === null) return res.status(400).json({ error: 'Echec de la demande' })
    else {
      const data = {
        message: 'Votre décharge est en cours de nettoyage',
        idUser: [updated.creator],
        idDump: updated._id
      }
      sendNotification(data).then((response) => {
        return res.status(200).json(updated);
      })
    }
  });
};

export const updateCleaningDemand = (req, res) => {
  if (req.params.cleaningDemandId === undefined
    || typeof req.params.cleaningDemandId !== 'string'
    || req.body.cleanerId === undefined
    || typeof req.body.cleanerId !== 'string') {
    return res.status(400).json({ error: 'Paramètres manquants ou non valides' })
  }
  if (req.body.status === 'accepted') {
    Dump.findOne({
      $and: [
        {
          "cleaningDemands": {
            "$elemMatch": {
              "_id": req.params.cleaningDemandId
            }
          }
        },
        {
          "cleaner": null
        }
      ]
    })
      .lean()
      .exec((err, dump) => {
        if (err) return res.status(400).json(err);
        if (dump === null) return res.status(400).json({ error: 'Décharge non trouvée' });
        const demandsArr = [];
        dump.cleaningDemands.forEach((demand) => {
          const demandObj = {
            ...demand
          };
          if (demand._id.toString() === req.params.cleaningDemandId.toString()) {
            demandObj.status = "accepted";
          } else if (demand._id.toString() !== req.params.cleaningDemandId.toString() && demand.status === 'waiting') {
            demandObj.status = "refused";
          }
          demandsArr.push(demandObj);
        })
        Dump.updateOne({
          $and: [
            {
              "cleaningDemands": {
                "$elemMatch": {
                  "_id": req.params.cleaningDemandId
                }
              }
            },
            {
              "cleaner": null
            }
          ]
        },
          {
            $set: {
              "cleaner": req.body.cleanerId,
              "status": "closed",
              "cleaningDemands": demandsArr
            }
          },
          { new: true })
          .lean()
          .exec((error, updatedDump) => {
            if (error) return res.status(400).json(error);
            const data = {
              message: 'Nettoyage de la décharge validé',
              idUser: [updatedDump.creator, updatedDump.cleaner],
              idDump: updatedDump._id
            }
            addXp(150, updatedDump.cleaner);
            sendNotification(data).then((response) => {
              return res.status(200).json(updatedDump);
            })
          })
      })
  } else if (req.body.status === 'refused') {
    Dump.findOneAndUpdate({
      $and: [
        {
          "cleaningDemands": {
            "$elemMatch": {
              "_id": req.params.cleaningDemandId
            }
          }
        },
      ]
    },
      {
        "$set": {
          "status": "open",
          "cleaningDemands.$.status": req.body.status,
        }
      },
      { new: true })
      .lean()
      .exec((err, updated) => {
        if (err) return res.status(400).json(err);
        if (updated === null) return res.status(400).json({ error: 'décharge non trouvée' });
        return res.status(200).json(updated);
      })
  } else {
    return res.status(400).json({ error: 'Statut non valide' });
  }
};

export const deleteDump = (req, res) => { };
