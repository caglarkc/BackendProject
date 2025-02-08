const ValidationError = require('./errors/ValidationError');
const NotFoundError = require('./errors/NotFoundError');
const errorMessages = require('../config/errorMessages');
const User = require('../models/User');
const { comparePassword, hashPassword } = require('./hashPassword');
const AuthError = require('./errors/AuthError');
const TokenService = require('../services/TokenService');
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

const validateAddressName = (name) => {
    if (!name) {
        throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE, { type: 'Address name' });
    }
    if (!isValidName(name)) {
        throw new ValidationError(errorMessages.VALIDATION.INVALID_ADDRESS_NAME);
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

const validateAddress = (address) => {
    if(!address) {
        throw new NotFoundError(errorMessages.NOT_FOUND.ADDRESS);
    }
    if(Array.isArray(address) && address.length === 0) {
        throw new NotFoundError(errorMessages.NOT_FOUND.ADDRESS);
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

const validateInput = (input, type = null) => {
    // Her durumda boşluk kontrolü yap
    if(!input || input.trim() === "") {
        throw new ValidationError(
            type 
                ? errorMessages.VALIDATION.EMPTY_FIELD_WITH_TYPE 
                : errorMessages.VALIDATION.EMPTY_FIELD,
            type ? { type } : undefined
        );
    }

    // Eğer type belirtilmemişse sadece boşluk kontrolü yeterli
    if (!type) return;

    // Type belirtilmişse ileri validasyonlar
    switch(type.toLowerCase()) {
        case 'street':
            if(input.length < 2 || input.length > 100) {
                throw new ValidationError(errorMessages.VALIDATION.INVALID_STREET);
            }
            break;
        
        case 'apartment':
            if(input.length < 1 || input.length > 50) {
                throw new ValidationError(errorMessages.VALIDATION.INVALID_APARTMENT);
            }
            break;
            
        case 'description':
            if(input.length > 500) {
                throw new ValidationError(errorMessages.VALIDATION.INVALID_DESCRIPTION);
            }
            break;

        case 'floor':
            if(!isValidNumber(input) || input < -5 || input > 200) {
                throw new ValidationError(errorMessages.VALIDATION.INVALID_FLOOR);
            }
            break;

        case 'door':
            if(!isValidNumber(input) || input < 1 || input > 1000) {
                throw new ValidationError(errorMessages.VALIDATION.INVALID_DOOR);
            }
            break;

        case 'postal_code':
            if(!isValidNumber(input) || input.length !== 5) {
                throw new ValidationError(errorMessages.VALIDATION.INVALID_POSTAL_CODE);
            }
            break;

        default:
            throw new ValidationError(errorMessages.VALIDATION.INVALID_INPUT_TYPE);
    }
};



const compareTwoData = (data1, data2) => {
    if(data1 !== data2) {
        return false;
    }
    return true;
};

const validateEmail = (email) => {
    if(!email) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.EMAIL);
    }
    if(!isValidEmail(email)) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.INVALID_EMAIL);
    }
};

const validateName = (name) => {
    if(!name) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.NAME);
    }
    if(!isValidName(name)) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.INVALID_NAME);
    }
};

const validateSurname = (surname) => {
    if(!surname) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.SURNAME);
    }
    if(!isValidName(surname)) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.INVALID_SURNAME);
    }
};

const validatePassword = (password) => {
    if(!password) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.PASSWORD);
    }
    if(!isValidPassword(password)) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.INVALID_PASSWORD);
    }
};

const validatePasswordWithConfirmation = (password, confirmPassword) => {
    if (!password || !confirmPassword) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.PASSWORD);
    }
    if (!isValidPassword(password)) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.INVALID_PASSWORD);
    }   
    if(password !== confirmPassword) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.PASSWORDS_NOT_MATCH);
    }
};

const validatePhone = (phone) => {
    if(!phone) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.PHONE);
    }
    if(!isValidPhoneNumber(phone)) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.INVALID_PHONE);
    }
};

const validateUser = async (userId) => {
    if(!userId) {
        throw new ValidationError(errorMessages.AUTH.EMPTY.USER_ID);
    }
    const user = await User.findById(userId);
    if(!user) {
        throw new NotFoundError(errorMessages.NOT_FOUND.USER);
    }

    return user;
};

const validateLoginCheck = async (userId, password) => {
    const user = await validateUser(userId);
    if (!password) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.PASSWORD);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if(!isPasswordValid) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.INVALID_CREDENTIALS);
    }

    return user;
};

const validateChange = async (userId, password, newData, type) => {
    const user = await validateLoginCheck(userId, password);
    let compare = null;
    let existing = null;
    if(type === 'phone') {
        validatePhone(newData);
        compare = compareTwoData(user.phone, newData);
        existing = await User.findOne({ phone: newData });
    }else if (type === 'email') {
        validateEmail(newData);
        compare = compareTwoData(user.email, newData);
        existing = await User.findOne({ email: newData });
    }else if (type === 'name') {
        validateName(newData);
        compare = compareTwoData(user.name, newData);
        existing = false;
    }else if (type === 'surname') {
        validateSurname(newData);
        compare = compareTwoData(user.surname, newData);
        existing = false;
    }else if (type === 'password') {
        validatePassword(newData);
        compare = await comparePassword(user.password, newData);
        existing = false;
    }
    
    if(compare) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.DUPLICATE_INFOS, { type: type });
    }

    if(existing) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.EXISTING_INFOS, { type: type });
    }

    return user;
};

const validateRegister = async (userData) => {
    const { name, surname, email, phone, password, confirmPassword} = userData;
    validateName(name);
    validateSurname(surname);
    validateEmail(email);
    validatePhone(phone);
    validatePasswordWithConfirmation(password, confirmPassword);

    if(await User.findOne({ email })) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.EXISTING_INFOS, { type: 'Email' });
    }
    
    if(await User.findOne({ phone })) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.EXISTING_INFOS, { type: 'Telefon numarası' });
    }

    return true;
};

const validateLogin = async (loginData) => {
    const { email, phone, password } = loginData;
    let user = null;
    if(!email && !phone) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.INVALID_LOGIN_DATA);
    }else if (email && phone) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.INVALID_LOGIN_DATA_BOTH);
    }
    if(email) {
        validateEmail(email);
        user = await User.findOne({ email });
        if(!user) {
            throw new ValidationError(errorMessages.AUTH.NOT_FOUND.USER);
        }
    }else if(phone) {
        validatePhone(phone);
        user = await User.findOne({ phone });
        if(!user) {
            throw new ValidationError(errorMessages.AUTH.NOT_FOUND.USER);
        }
    }

    user = await validateLoginCheck(user._id, password);
    

    return user;
};

const validateLogout = async (userId) => {
    const user = await validateUser(userId);
    
    if (!user.isLoggedIn) {
        throw new AuthError(errorMessages.AUTH.AUTH.NOT_LOGGED_IN);
    }

    if (!user.refreshToken) {
        throw new AuthError(errorMessages.AUTH.AUTH.NO_ACTIVE_SESSION);
    }

    return user;
};

const validateForgotPassword = async (userData) => {
    const { email, phone } = userData;
    
    if (!email && !phone) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.INVALID_LOGIN_DATA);
    }
    
    if (email && phone) {
        throw new ValidationError(errorMessages.AUTH.VALIDATION.INVALID_LOGIN_DATA_BOTH);
    }
    
    let user = null;
    if (email) {
        validateEmail(email);
        user = await User.findOne({ email });
    } else {
        validatePhone(phone);
        user = await User.findOne({ phone });
    }
    
    if (!user) {
        throw new NotFoundError(errorMessages.AUTH.NOT_FOUND.USER);
    }
    
    return { user, type: email ? 'email' : 'phone' };
};

const validateRefresh = async (refreshToken) => {
    if (!refreshToken) {
        throw new AuthError(errorMessages.AUTH.AUTH.REFRESH_TOKEN_REQUIRED);
    }

    let decoded;
    try {
        const tokenResult = await TokenService.verifyRefreshToken(refreshToken);
        if (!tokenResult) {
            throw new AuthError(errorMessages.AUTH.AUTH.INVALID_REFRESH_TOKEN);
        }
        decoded = tokenResult;
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            throw new AuthError(errorMessages.AUTH.AUTH.INVALID_REFRESH_TOKEN);
        }
        throw error;
    }

    const user = await User.findOne({ _id: decoded.userId, refreshToken });
    if (!user) {
        throw new AuthError(errorMessages.AUTH.AUTH.INVALID_REFRESH_TOKEN);
    }

    return user;
};

module.exports = {
    validateUser,
    validateLoginCheck,
    validateChange,
    validateRegister,
    validateLogin,
    validateLogout,
    validateForgotPassword,
    validateRefresh,
    validateAddress,
    validateAddressId,  
    validateUserId,
    validateUserRole,
    validateMatch,
    validateDuplicate,
    validateDuplicateTwo,
    validateInput,
    validateEmail,
    validateName,
    validateSurname,
    validatePassword,
    validatePasswordWithConfirmation,
    validatePhone,
    validateLoginData,
    validateNumber,
    validateText,
    validateAddressName
};