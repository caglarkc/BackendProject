const mongoose = require('mongoose');
const textUtils = require('../textUtils');

const farmerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'İsim alanı zorunludur'],
        validate: {
            validator: function(v) {
                return textUtils.isValidText(v);
            },
            message: props => `${props.value} is not a valid name!`
        }
    },
    location: {
        type: String,
        required: [true, 'Lokasyon alanı zorunludur'],
        validate: {
            validator: function(v) {
                return textUtils.isValidText(v);
            },
            message: props => `${props.value} is not a valid location!`
        }
    },
    email: {
        type: String,
        required: [true, 'Email alanı zorunludur'],
        unique: true,
        validate: {
            validator: function(v) {
                return textUtils.isValidEmail(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    phone: {
        type: String,
        unique: true,
        required: [true, 'Telefon alanı zorunludur'],
        validate: {
            validator: function(v) {
                return textUtils.isValidPhoneNumber(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Farmer', farmerSchema); 