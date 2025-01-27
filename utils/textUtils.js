const ValidationError = require('./errors/ValidationError');
const errorMessages = require('../config/errorMessages');
const User = require('../models/User');

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
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'Phone' });
    }
    if (!isValidPhoneNumber(phone)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_PHONE);
    }
};

const validateEmail = (email) => {
    if (!email) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'Email' });
    }
    if (!isValidEmail(email)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_EMAIL);
    }
};

const validateName = (name) => {
    if (!name) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'Name' });
    }
    if (!isValidName(name)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_NAME);
    }
};

const validateAddressName = (name) => {
    if (!name) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'Address name' });
    }
    if (!isValidName(name)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_ADDRESS_NAME);
    }
};

const validateSurname = (surname) => {
    if (!surname) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'Surname' });
    }
    if (!isValidName(surname)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_SURNAME);
    }
};

const validatePassword = (password) => {
    if (!password) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'Password' });
    }
    if (!isValidPassword(password)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_PASSWORD);
    }
};

const validateText = (text) => {
    if (!text) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'Text' });
    }
    if (!isValidText(text)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_TEXT);
    }
};

const validateNumber = (number) => {
    if (!number) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'Number' });
    }
    if (!isValidNumber(number)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_NUMBER);
    }
};

const validatePasswordWithConfirmation = (password, confirmPassword) => {
    if (!password || !confirmPassword) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'Password' });
    }
    if (!isValidPassword(password)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_PASSWORD);
    }   
    if(password !== confirmPassword) {
        throw new ValidationError(errorMessages.VALIDATION.PASSWORDS_NOT_MATCH);
    }
};

const validateMatch = (data1, data2) => {
    if(data1 !== data2) {
        throw new ValidationError(errorMessages.VALIDATION.MATCH_NOT_FOUND);
    }
};

const validateAddressId = (id) => {
    if(!id) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'Address id' });
    }
    // ObjectId formatını kontrol et (24 karakterli hexadecimal)
    if(!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_ADDRESS_ID);
    }
};

const validateUserId = (id) => {
    if(!id) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'User id' });
    }
    // ObjectId formatını kontrol et (24 karakterli hexadecimal)
    if(!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_USER_ID);
    }
};

const validateUserRole = (role) => {
    if(!role) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'User role' });
    }
};

const validateUser = (user) => {
    if(!user) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_USER);
    }
};

const validateAddress = (address) => {
    if(!address) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_ADDRESS);
    }
};

const validateLoginData = async (email, phone) => {    
    // İkisi de boşsa hata fırlat
    if(!email && !phone) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'Email or Phone' });
    }
    
    // İkisi de doluysa hata fırlat
    if(email && phone) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_LOGIN_DATA);
    }
    
    // Hangisi doluysa onu validate et ve sistemde var mı kontrol et
    if(email) {
        validateEmail(email);
        const user = await User.findOne({ email });
        if(!user) {
            throw new ValidationError(errorMessages.VALIDATION.EMAIL_NOT_REGISTERED);
        }
        return 'email';
    }
    if(phone) {
        validatePhone(phone);
        const user = await User.findOne({ phone });
        if(!user) {
            throw new ValidationError(errorMessages.VALIDATION.PHONE_NOT_REGISTERED);
        }
        return 'phone';
    }
};

const validateDuplicate = (data1, data2, type) => {
    if(data1 === data2) {
        throw new ValidationError(errorMessages.VALIDATION.DUPLICATE_INFOS, { type: type });
    }
};

const validateDuplicateTwo = (data1a, data1b, data2a, data2b, type1, type2) => {
    // Boşluk kontrolleri
    if(!data1a || !data1b || !data2a || !data2b) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
    }

    // En az biri farklı olmalı
    if(data1a === data2a && data1b === data2b) {
        throw new ValidationError(errorMessages.VALIDATION.DUPLICATE_INFOS, { type: `${type1} ve ${type2}` });
    }
};

const validateInput = (input) => {
    if(!input || input.trim() === "") {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
    }
};

module.exports = {
    isEmpty,
    validateMatch,
    validateInput,
    isValidPhoneNumber,
    isValidEmail,
    isValidNumber,
    isValidText,
    isValidName,
    validateDuplicateTwo,
    isValidPassword,
    validatePhone,
    validateEmail,
    validateName,
    validatePassword,
    validateText,
    validateNumber,
    validateLoginData,
    validatePasswordWithConfirmation,
    validateAddressName,
    validateSurname,
    validateAddressId,
    validateUserId,
    validateUserRole,
    validateUser,
    validateAddress,
    validateDuplicate
};