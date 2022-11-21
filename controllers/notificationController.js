/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import Notification from '../models/notificationModel.js';

dotenv.config();

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

export const updateNotification = (req, res) => {
    Notification.updateOne({ _id: req.body.notificationId }, { $set: { ...req.body.notificationData } })
    .exec((err, updated) => {
        if (err) return res.status(400).json(err);
        else {
            return res.status(200).json({ message: 'Notification updated' });
        }
    })
}

export const deleteNotification = (req, res) => {

}