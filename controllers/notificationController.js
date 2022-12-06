/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

dotenv.config();

export const sendNotificationToAdmin = (data) => {
    User.find({ role: 'admin' })
    .select('_id')
    .lean()
    .exec((error, adminArr) => {
        if (error) return error;
        if (adminArr.length === 0) return 'No administrators found'
        const notification = new Notification({
            content: data.message,
            seen: false,
            idUser: adminArr,
            idDump: data.idDump,
            idEvent: data.idEvent,
            idInvite: data.idInvite
        })
        return notification.save()
        .then((res) => res)
        .catch((err) => err);
    })
}

export const sendNotification = (data) => {
    const notification = new Notification({
        content: data.message,
        seen: false,
        idUser: data.idUser,
        idDump: data.idDump,
        idEvent: data.idEvent,
        idInvite: data.idInvite
    })
    return notification.save()
    .then((res) => res)
    .catch((err) => err);
}

export const addNotification = async (req, res) => {

  const notification = new Notification({
  });

  notification.save()
    .then((response) => {
      return res.status(201).json(response);
    })
    .catch((err) => res.status(400).json(err));
}

export const getNotification = async (req, res) => {
    Notification.findOne({ '_id': req.body.notificationId })
    .lean()
    .exec((err, notification) => {
        if (err) return res.status(400).json(err);
        else if (notification === null) {
            return res.status(400).json({ error: 'No notification found' });
        }
        else {
            return res.status(200).json(notification);
        }
    })
}

export const getNotifications = (req, res) => {
    Notification.find()
    .lean()
    .exec((err, notifications) => {
        if (err) return res.status(400).json(err);
        else if (notifications.length === 0) {
            return res.status(400).json({ error: 'No notifications found' });
        }
        else {
            return res.status(200).json(notifications);
        }
    })
}

export const getNotificationsByUser = (req, res) => {
    Notification.find({ idUser: req.params.userId })
    .lean()
    .exec((err, notifications) => {
        if (err) return res.status(400).json(err);
        else if (notifications.length === 0) {
            return res.status(400).json({ error: 'No notifications found' });
        }
        else {
            return res.status(200).json(notifications);
        }
    })
}

export const updateNotification = (req, res) => {
    Notification.updateOne({ _id: req.params.notificationId }, { ...req.body })
    .exec((err, updated) => {
        if (err) return res.status(400).json(err);
        else {
            return res.status(200).json({ message: 'Notification updated' });
        }
    })
}

export const deleteNotification = (req, res) => {

}