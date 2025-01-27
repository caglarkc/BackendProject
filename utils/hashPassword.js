const bcrypt = require('bcrypt');
const AuthError = require('./errors/AuthError');
const errorMessages = require('../config/errorMessages');

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword
};
