const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    lastLoginAt: {
        type: Date,
        default: null
    },
    lastLogoutAt: {
        type: Date,
        default: null
    },
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'  
    }],
    defaultAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }
}, { timestamps: true });

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};



module.exports = mongoose.model('User', userSchema);