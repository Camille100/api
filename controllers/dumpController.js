/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import Dump from '../models/dumpModel.js';

dotenv.config();

export const addDump = async (req, res) => {
//   if (!req.body.comment ||  !typeof req.body.comment === 'string') return res.status(400).json({ error: 'Must be a string' });
  
  const dump = new Dump(req.body);

  dump.save()
    .then((response) => {
      return res.status(201).json(response);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).json(err)
    });
}

export const getDump = async (req, res) => {
    Dump.findOne({ '_id': req.body.equipmentId })
    .lean()
    .exec((err, equipment) => {
        if (err) return res.status(400).json(err);
        else if (equipment === null) {
            return res.status(400).json({ error: 'No dump found' });
        }
        else {
            return res.status(200).json(equipment);
        }
    })
}

export const getDumps = (req, res) => {
    Dump.find()
    .lean()
    .exec((err, dumps) => {
        if (err) return res.status(400).json(err);
        else if (dumps.length === 0) {
            return res.status(400).json({ error: 'No dumps found' });
        }
        else {
            return res.status(200).json(dumps);
        }
    })
}

export const updateDump = (req, res) => {
    Dump.updateOne({ _id: req.body.dumpId }, { $set: { ...req.body.dumpData } })
    .exec((err, updated) => {
        if (err) return res.status(400).json(err);
        else {
            return res.status(200).json({ message: 'Dump updated' });
        }
    })
}

export const deleteDump = (req, res) => {

}