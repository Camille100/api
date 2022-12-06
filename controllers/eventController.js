/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import Event from '../models/eventModel.js';
import { sendNotification } from './notificationController.js';
import { addXp } from './userController.js';

dotenv.config();

export const addEvent = async (req, res) => {
  if (!req.body.comment || typeof req.body.comment !== 'string')
    return res.status(400).json({ error: 'Must be a string' });
  // if (
  //     !req.body.coordinates ||
  //     typeof req.body.coordinates.longitude !== 'number' ||
  //     typeof req.body.coordinates.latitude !== 'number'
  // ) {
  //     return res.status(400).json({ error: 'Missing coordinates' });
  // }

  const equipmentArr = [];
  if (req.body.equipment && req.body.equipment.length > 0) {
    req.body.equipment.forEach((equipment) => {
      if (equipment.id) {
        equipmentArr.push(equipment.id);
      }
    });
  }
  const event = new Event({
    creator: req.body.creator,
    comment: req.body.comment,
    status: req.body.status,
    beginDate: req.body.beginDate,
    endDate: req.body.endDate,
    equipments: equipmentArr,
    accessible: {
      ...req.body.accessible,
    },
    location: req.body.location,
    center: req.body.center,
  });

  event.save()
    .then((response) => {
      addXp(150, req.body.creator);
      return res.status(201).json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

export const getEvents = (req, res) => {
  Event.find()
    .populate([
      {
        path: 'equipments',
        select: 'name',
      },
    ])
    .lean()
    .exec((err, events) => {
      if (err) return res.status(400).json(err);
      else if (events.length === 0) {
        return res.status(400).json({ error: 'No events found' });
      } else {
        return res.status(200).json(events);
      }
    });
};

export const getEventsByUser = (req, res) => {
  Event.find({ $or: [{ creator: req.params.userId }, { "participants.userId": req.params.userId }] })
    .populate([
      {
        path: 'equipments',
        select: 'name',
      },
      {
        path: 'participants.userId',
        select: 'email pseudo',
      },
    ])
    .lean()
    .exec((err, events) => {
      if (err) return res.status(400).json(err);
      else if (events.length === 0) {
        return res.status(400).json({ error: 'No events found' });
      } else {
        const subscribedEvents = [];
        const declaredEvents = [];
        events.forEach((event) => {
          if (event.creator.toString() === req.params.userId.toString()) {
            declaredEvents.push(event);
          }
          event.participants.forEach((participant) => {
            if (participant.userId._id.toString() === req.params.userId.toString()) {
              subscribedEvents.push(event);
            }
          })
        })
        const formatedEvents = { subscribedEvents, declaredEvents };
        return res.status(200).json(formatedEvents);
      }
    });
};

export const getEvent = async (req, res) => {
  Event.findOne({ _id: req.params.eventId })
    .populate([
      {
        path: 'equipments',
        select: 'name',
      },
    ])
    .lean()
    .exec((err, event) => {
      if (err) return res.status(400).json(err);
      else if (event === null) {
        return res.status(400).json({ error: 'No event found' });
      } else {
        return res.status(200).json(event);
      }
    });
};

export const subscribeEvent = (req, res) => {
  Event.findOneAndUpdate(
    { _id: req.params.eventId },
    { $push: { participants: { userId: req.body.userId } } },
    {new: true}
  )
    .lean()
    .exec((error, updatedEvent) => {
      if (error) return res.status(400).json(error);
      const data = {
        message: "Un utilisateur s'est inscrit à votre évènement",
        idUser: [updatedEvent.creator],
        idEvent: updatedEvent._id
      }
      sendNotification(data).then(() => {
        return res.status(200).json({ message: 'User subscribed' });
      })
    })
}

export const confirmAttendance = (req, res) => {
  Event.findOneAndUpdate(
    { _id: req.params.eventId, "participants.userId": req.body.userId },
    { $set: {"participants.$.present": true} },
    {new: true}
  )
    .lean()
    .exec((error, updatedEvent) => {
      if (error) return res.status(400).json(error);
        addXp(300, req.body.userId);
        return res.status(200).json({ message: 'User subscribed' });
    })
}

export const updateEvent = (req, res) => {
  Event.findOneAndUpdate(
    { _id: req.params.eventId },
    { ...req.body },
    { new: true })
    .lean()
    .exec((err, updatedEvent) => {
      if (err) return res.status(400).json(err);
      else if (updatedEvent === null) {
        return res.status(400).json({ error: 'No event found' });
      } else {
        return res.status(200).json(updatedEvent);
      }
    })
};

export const deleteEvent = (req, res) => {

};