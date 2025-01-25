const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    addressName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    neighborhood: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    apartment: {
        type: String,
        required: true
    },
    floor: {
        type: String,
        required: true
    },
    door: {
        type: String,
        required: true
    },
    postal_code: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema); 