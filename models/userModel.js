import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    pseudo: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    expireToken: {
        type: Date
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    xp: {
        type: Number,
        required: true
    },
    avatar: {
        type: String
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const User = mongoose.model('User', userSchema);

export default User;