/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

export const addXp = (xp, userId) => {
    User.findOneAndUpdate(
        { _id: userId },
        { $inc: { "xp": xp } },
        { new: true })
    .lean()
    .exec((err, userUpdated) => {
        if (err) return err;
        return userUpdated;
    })
};

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
            role: user.role,
            xp: user.xp,
            avatar: user.avatar
          }
            return res.status(200).json(userInfos);
        }
    })
}

export const getUsers = (req, res) => {
    User.find()
    .select('pseudo email role created_at updated_at xp')
    .lean()
    .exec((err, users) => {
        if (err) return res.status(400).json(err);
        else if (users === null) {
            return res.status(400).json({ error: 'No users found' });
        }
        else {
            const formattedUsers = [];
            users.forEach((user) => {
                const userObj = {
                    id: user._id,
                    ...user
                }
                formattedUsers.push(userObj);
            })
            return res.status(200).json(formattedUsers);
        }
    })
}

export const searchUser = (req, res) => {
    if (typeof req.body.search !== 'string' || req.body.search === undefined || req.body.search === null) {
        return res.status(400).json({ error: 'Unauthorized search' })
    }
    User.find({
        $or: [
            { "email": {"$regex": req.body.search, "$options": "i"} },
            { "pseudo": {"$regex": req.body.search, "$options": "i"} }
        ]
    })
    .limit(3)
    .lean()
    .exec((err, users) => {
        if (err) return res.status(400).json(err);
        else if(users.length === 0) return res.status(400).json({ error: 'No users found' });
        else {
            const formatedUsers = [];
            users.forEach((user) => {
                formatedUsers.push({
                    id: user._id,
                    email: user.email,
                })
            });
            return res.status(200).json(formatedUsers);
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