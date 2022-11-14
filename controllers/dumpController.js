/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import Dump from '../models/dumpModel.js';

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
            return res.status(201).json(response);
        })
        .catch((err) => {
            console.log(err);
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
    Dump.find({ $or: [ { creator: req.params.userId }, { cleaner: req.params.userId } ] })
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
                    } else if (dump.cleaner.toString() === req.params.userId.toString()) {
                        cleanedDumps.push(dump);
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

export const deleteDump = (req, res) => {};