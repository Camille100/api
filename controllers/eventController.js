/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import Event from '../models/eventModel.js';

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
    });

    event.save()
        .then((response) => {
            return res.status(201).json(response);
        })
        .catch((err) => {
            console.log(err);
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