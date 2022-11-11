import mongoose, { Schema } from 'mongoose';

const equipmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;