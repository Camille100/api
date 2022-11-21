import mongoose, { Schema } from 'mongoose';
import { pointSchema } from './pointModel.js';

const dumpSchema = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cleaningDemands: [
        {
            cleaner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            status: {
                type: String,
                default: 'waiting',
                enum: ['waiting', 'accepted', 'refused']
            },
            pictures: [
                {
                    type: String
                }
            ]
        }
    ],
    cleaner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'open',
        enum: ['open', 'waiting', 'closed'],
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
    },
    pictures: [
        { type: "String", required: true }
    ]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Dump = mongoose.model('Dump', dumpSchema);

export default Dump;