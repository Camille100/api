import mongoose, { Schema } from 'mongoose';
import { polygonSchema } from './polygonModel.js';

const eventSchema = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['public', 'private'],
        required: true,
    },
    beginDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
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
        type: polygonSchema,
        required: true
    },
    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;