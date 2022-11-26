import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false,
        required: true
    },
    idUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    idDump: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dump'
    },
    idEvent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    idInvite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invite'
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;