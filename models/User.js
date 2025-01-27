const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        default: null
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'  
    }],
    defaultAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);