const User = require('../models/User');
const Log = require('../models/Log');
const textUtils = require('../utils/textUtils');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const ValidationError = require('../utils/errors/ValidationError');
const AuthError = require('../utils/errors/AuthError');
const errorMessages = require('../config/errorMessages');
const { createRefreshToken, createAccessToken, verifyToken } = require('../utils/tokenUtils');

exports.register = async (userData) => {
    const { name, surname, email, phone, password, confirmPassword } = userData;
    
    // Validation checks
    textUtils.validateName(name);
    textUtils.validateSurname(surname);
    textUtils.validateEmail(email);
    textUtils.validatePhone(phone);
    textUtils.validatePasswordWithConfirmation(password, confirmPassword);
    
    if(await User.findOne({ email })) {
        throw new ValidationError(errorMessages.VALIDATION.DUPLICATE_EMAIL);
    }
    
    if(await User.findOne({ phone })) {
        throw new ValidationError(errorMessages.VALIDATION.DUPLICATE_PHONE);
    }
    
    const user = new User({ 
        name, 
        surname, 
        email, 
        phone, 
        password: await hashPassword(password)
    });
    await user.save();
    
    return user;
};

exports.login = async (loginData) => {
    try {
        const { email, phone, password } = loginData;
        
        // Email veya telefon validasyonu ve sistemde var mı kontrolü
        const dataType = await textUtils.validateLoginData(email, phone);
        textUtils.validatePassword(password);

        // Kullanıcıyı bul
        const query = dataType === 'email' ? { email } : { phone };
        const user = await User.findOne(query);
        
        // Kullanıcı yoksa hata fırlat
        textUtils.validateUser(user);
        
        // Şifre kontrolü
        const isPasswordValid = await comparePassword(password, user.password);
        if(!isPasswordValid) {
            throw new AuthError(errorMessages.AUTH.WRONG_PASSWORD);
        }

        const refreshToken = createRefreshToken(user._id);
        const accessToken = createAccessToken(user._id);
        
        // Refresh token'ı veritabanına kaydet ve güncel kullanıcı bilgilerini al
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { refreshToken },
            { new: true }
        );
        
        return { user: updatedUser, accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};

exports.refresh = async (refreshToken) => {
    try {
        if (!refreshToken) {
            throw new AuthError(errorMessages.AUTH.REFRESH_TOKEN_REQUIRED);
        }

        // Refresh token'ı doğrula
        const decoded = verifyToken(refreshToken, true);
        if (!decoded) {
            throw new AuthError(errorMessages.AUTH.INVALID_REFRESH_TOKEN);
        }

        // Kullanıcıyı ve token'ı kontrol et
        const user = await User.findOne({ _id: decoded.userId, refreshToken });
        if (!user) {
            throw new AuthError(errorMessages.AUTH.INVALID_REFRESH_TOKEN);
        }

        // Yeni access token oluştur
        const accessToken = createAccessToken(user._id);
        
        return { accessToken };
    } catch (error) {
        throw error;
    }
};
