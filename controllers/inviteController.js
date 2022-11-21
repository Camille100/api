/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import Invite from '../models/inviteModel.js';

dotenv.config();

export const addInvite = async (req, res) => {

  const invite = new Invite({
  });

  invite.save()
    .then((response) => {
      return res.status(201).json(response);
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

export const updateInvite = (req, res) => {
    Invite.updateOne({ _id: req.body.inviteId }, { $set: { ...req.body.inviteData } })
    .exec((err, updated) => {
        if (err) return res.status(400).json(err);
        else {
            return res.status(200).json({ message: 'Invite updated' });
        }
    })
}

export const deleteInvite = (req, res) => {

}