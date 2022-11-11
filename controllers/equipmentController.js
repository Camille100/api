/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import Equipment from '../models/equipmentModel.js';

dotenv.config();

export const addEquipment = async (req, res) => {
  if (!req.body.name ||  !typeof req.body.name === 'string') return res.status(400).json({ error: 'Must be a string' });
  
  const equipment = new Equipment({
    name: req.body.name,
  });

  equipment.save()
    .then((response) => {
      return res.status(201).json(response);
    })
    .catch((err) => res.status(400).json(err));
}

export const getEquipment = async (req, res) => {
    Equipment.findOne({ '_id': req.body.equipmentId })
    .lean()
    .exec((err, equipment) => {
        if (err) return res.status(400).json(err);
        else if (equipment === null) {
            return res.status(400).json({ error: 'No equipment found' });
        }
        else {
            return res.status(200).json(equipment);
        }
    })
}

export const getEquipments = (req, res) => {
    Equipment.find()
    .lean()
    .exec((err, equipments) => {
        if (err) return res.status(400).json(err);
        else if (equipments.length === 0) {
            return res.status(400).json({ error: 'No equipments found' });
        }
        else {
            return res.status(200).json(equipments);
        }
    })
}

export const updateEquipment = (req, res) => {
    Equipment.updateOne({ _id: req.body.equipmentId }, { $set: { ...req.body.equipmentData } })
    .exec((err, updated) => {
        if (err) return res.status(400).json(err);
        else {
            return res.status(200).json({ message: 'Equipment updated' });
        }
    })
}

export const deleteEquipment = (req, res) => {

}