import express from 'express';
import { addEquipment, getEquipments } from '../controllers/equipmentController.js';

const router = express.Router();

router.post('/add', addEquipment);
router.get('/equipments', getEquipments);

export default router;