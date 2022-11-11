import mongoose, { Schema } from 'mongoose';
import { pointSchema } from './pointModel.js';

const dumpSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'open',
        required: true,
    },
    equipments: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }
    ],
    accessible: {
        onFoot: {
            type: Boolean,
            default: false,
        },
        onCar: {
            type: Boolean,
            default: false,
        }
    },
    location: {
        type: pointSchema,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Dump = mongoose.model('Dump', dumpSchema);

export default Dump;