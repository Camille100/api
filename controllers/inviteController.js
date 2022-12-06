/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import Invite from '../models/inviteModel.js';
import Event from '../models/eventModel.js';
import { sendNotification } from './notificationController.js';

dotenv.config();

export const addInvite = async (req, res) => {

  const invite = new Invite({
    status: req.body.status,
    idSender: req.body.idSender,
    idReceiver: req.body.idReceiver,
    idEvent: req.body.idEvent
  });

  invite.save()
    .then((response) => {
      const data = {
        message: 'Vous avez reçu une invitation à un évènement',
        idUser: [req.body.idReceiver],
        idEvent: req.body.idEvent
      }
      sendNotification(data).then(() => {
        return res.status(200).json(response);
      })
    })
    .catch((err) => res.status(400).json(err));
}

export const getInvite = async (req, res) => {
  Invite.findOne({ '_id': req.body.inviteId })
    .lean()
    .exec((err, invite) => {
      if (err) return res.status(400).json(err);
      else if (invite === null) {
        return res.status(400).json({ error: 'No invite found' });
      }
      else {
        return res.status(200).json(invite);
      }
    })
}

export const getInvites = (req, res) => {
  Invite.find()
    .lean()
    .exec((err, invites) => {
      if (err) return res.status(400).json(err);
      else if (invites.length === 0) {
        return res.status(400).json({ error: 'No invites found' });
      }
      else {
        return res.status(200).json(invites);
      }
    })
}

export const getInvitesByUser = (req, res) => {
  Invite.find({
    $or: [
      { idSender: req.params.userId },
      { idReceiver: req.params.userId }
    ]
  })
    .populate([
      {
        path: 'idEvent',
        select: 'beginDate endDate',
      },
      {
        path: 'idSender',
        select: 'email pseudo'
      }
    ])
    .lean()
    .exec((err, invites) => {
      if (err) return res.status(400).json(err);
      else if (invites.length === 0) {
        return res.status(400).json({ error: 'No invites found' });
      }
      else {
        return res.status(200).json(invites);
      }
    })
}

export const updateInvite = (req, res) => {
  Invite.findOneAndUpdate(
    { _id: req.params.inviteId },
    { ...req.body },
    { new: true }
  )
    .populate([
      {
        path: 'idReceiver',
        select: 'email'
      }
    ])
    .lean()
    .exec((err, updatedInvite) => {
      if (err) return res.status(400).json(err);
      else {
        if (req.body.status && req.body.status === 'accepted') {
          Event.findOneAndUpdate(
            { _id: updatedInvite.idEvent },
            { $push: { participants: { userId: updatedInvite.idReceiver } } }
          )
            .lean()
            .exec((error, updatedEvent) => {
              if (error) return res.status(400).json(error);
              const data = {
                message: `L'invitation que vous avez envoyé à ${updatedInvite.idReceiver.email} a été acceptée`,
                idUser: [updatedInvite.idSender],
                idEvent: updatedEvent._id
              }
              sendNotification(data).then(() => {
                return res.status(200).json({ message: 'Invite accepted' });
              })
            })
        } else {
          const data = {
            message: `L'invitation que vous avez envoyé à ${updatedInvite.idReceiver.email} a été refusée`,
            idUser: [updatedInvite.idSender],
            idEvent: updatedInvite.idEvent
          }
          sendNotification(data).then(() => {
            return res.status(200).json({ message: 'Invite refused' });
          })
        }
      }
    })
}

export const deleteInvite = (req, res) => {

}