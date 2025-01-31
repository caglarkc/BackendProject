const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    objectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    objectType: {
        type: String,
        enum: ['User', 'IpRateLimit', 'AuthRateLimit', 'ProfileRateLimit'],
        required: true
    },
    actionType: {
        type: String,
        required: true    
    },
    ipAddress: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Log', logSchema);