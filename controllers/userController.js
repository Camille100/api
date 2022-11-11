/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

export const getUser = async (req, res) => {
    User.findOne({ '_id': req.body.userId })
    .lean()
    .exec((err, user) => {
        if (err) return res.status(400).json(err);
        else if (user === null) {
            return res.status(400).json({ error: 'No user found' });
        }
        else {
          const userInfos = {
            id: user._id,
            email: user.email,
            pseudo: user.pseudo,
            role: user.role
          }
            return res.status(200).json(userInfos);
        }
    })
}

export const getUsers = (req, res) => {
    User.find()
    .lean()
    .exec((err, users) => {
        if (err) return res.status(400).json(err);
        else if (users === null) {
            return res.status(400).json({ error: 'No users found' });
        }
        else {
            return res.status(200).json(users);
        }
    })
}

export const updateUser = (req, res) => {
    User.updateOne({ _id: req.body.userId }, { $set: { ...req.body.userData } })
    .exec((err, updated) => {
        if (err) return res.status(400).json(err);
        else {
            return res.status(200).json({ message: 'User updated' });
        }
    })
}

export const deleteUser = (req, res) => {

}