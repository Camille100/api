import mongoose, { Schema } from 'mongoose';

const inviteSchema = new Schema({
    status: {
        type: String,
        default: 'waiting',
        enum: ['waiting', 'accepted', 'refused'],
        required: true
    },
    idSender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    idReceiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    idEvent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Invite = mongoose.model('Invite', inviteSchema);

export default Invite;