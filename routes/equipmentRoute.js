import express from 'express';
import { addEquipment, getEquipments, getEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController.js';

const router = express.Router();

router.post('/add', addEquipment);
router.get('/equipments', getEquipments);
router.get('/:equipmentId', getEquipment);
router.put('/update/:equipmentId', updateEquipment);
router.delete('/delete/:equipmentId', deleteEquipment);

export default router;