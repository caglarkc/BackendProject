const { ValidationError } = require('./errors');
const errorMessages = require('../config/errorMessages');

const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

const isValidPhoneNumber = (num) => {
    return /^[0-9]{10}$/.test(num);
};

const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) && email.length >= 10;
};

const isValidNumber = (str) => {
    return /^[0-9]+$/.test(str);
};

const isValidText = (str) => {
    return /^[A-Za-zçÇğĞüÜşŞöÖıİ\s]+$/.test(str);
};

const isValidName = (str) => {
    return /^[A-Za-zçÇğĞüÜşŞöÖıİ\s]{2,}$/.test(str);
};

const isValidPassword = (str) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(str);
};

// Validation fonksiyonları
const validatePhone = (phone) => {
    if (!phone) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
    }
    if (!isValidPhoneNumber(phone)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_PHONE);
    }
};

const validateEmail = (email) => {
    if (!email) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
    }
    if (!isValidEmail(email)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_EMAIL);
    }
};

const validateName = (name) => {
    if (!name) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
    }
    if (!isValidName(name)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_NAME);
    }
};

const validatePassword = (password) => {
    if (!password) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
    }
    if (!isValidPassword(password)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_PASSWORD);
    }
};

const validateText = (text) => {
    if (!text) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
    }
    if (!isValidText(text)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_TEXT);
    }
};

const validateNumber = (number) => {
    if (!number) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
    }
    if (!isValidNumber(number)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_NUMBER);
    }
};

module.exports = {
    isEmpty,
    isValidPhoneNumber,
    isValidEmail,
    isValidNumber,
    isValidText,
    isValidName,
    isValidPassword,
    validatePhone,
    validateEmail,
    validateName,
    validatePassword,
    validateText,
    validateNumber
};