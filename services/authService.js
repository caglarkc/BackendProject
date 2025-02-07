const User = require('../models/User');
const textUtils = require('../utils/textUtils');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const ValidationError = require('../utils/errors/ValidationError');
const AuthError = require('../utils/errors/AuthError');
const errorMessages = require('../config/errorMessages');
const { createRefreshToken, createAccessToken, verifyToken } = require('../utils/tokenUtils');
const rateLimitService = require('../services/RateLimitService');
const { createLog } = require('./LogService');
const NotFoundError = require('../utils/errors/NotFoundError');
const BaseService = require('./BaseService');

// Kullanıcı bilgilerini filtreleme yardımcı metodu
const _formatUserResponse = (user) => {
    return {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};



class AuthService extends BaseService {
    
    async register(userData) {
        const ip = await this.getIp();
        const { name, surname, email, phone, password, confirmPassword} = userData;
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
    
        await rateLimitService.checkAndIncrementRegistration(ip);
        
        const user = await this.createUser({ 
            name, 
            surname, 
            email, 
            phone, 
            password
        });
    
        await createLog({
            objectId: user._id,
            objectType: 'User',
            actionType: 'register',
            ipAddress: ip
        });
        
        return _formatUserResponse(user);
    };
    
    async login(loginData) {
        try {
            const ip = await this.getIp();
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
            await createLog({
                objectId: updatedUser._id,
                objectType: 'User',
                actionType: 'login',
                ipAddress: ip
            });
            
            return { 
                user: _formatUserResponse(updatedUser), 
                accessToken, 
                refreshToken 
            };
        } catch (error) {
            throw error;
        }
    };
    
    async logout(userData) {
        try {
            const ip = await this.getIp();
            // Email veya telefon validasyonu
            const { email, phone } = userData;
            const dataType = textUtils.validateLoginData(email, phone);
            
            // Kullanıcıyı bul
            let user;
            if (dataType === 'email') {
                user = await User.findOne({ email });
            } else {
                user = await User.findOne({ phone });
            }
            
            if (!user) {
                throw new NotFoundError(errorMessages.USER.NOT_FOUND);
            }
    
            // Log oluştur
            await createLog({
                objectId: user._id,
                objectType: 'User',
                actionType: 'logout',
                ipAddress: ip
            });
    
            // Refresh token'ı temizle
            user.refreshToken = null;
            await user.save();
    
            return { success: true, message: "Çıkış başarılı." };
        } catch (error) {
            throw error;
        }
    };
    
    async forgotPassword(userData) {
        try {
            const ip = await this.getIp();
            const { email, phone } = userData;
            
            // Email veya telefon validasyonu
            const dataType = textUtils.validateLoginData(email, phone);
            
            // Kullanıcıyı bul
            let user;
            if(dataType === 'email') {
                user = await User.findOne({ email });
            } else {
                user = await User.findOne({ phone });
            }
            
            // Kullanıcı kontrolü
            textUtils.validateUser(user);
            
            // Log oluştur
            await createLog({
                objectId: user._id,
                objectType: 'User',
                actionType: 'forgotPassword',
                ipAddress: ip
            });
            
            // Email veya SMS gönderme durumuna göre mesaj döndür
            return {
                success: true,
                message: dataType === 'email' 
                    ? "Şifre sıfırlama e-postası gönderildi."
                    : "Şifre sıfırlama SMS gönderildi."
            };
        } catch (error) {
            throw error;
        }
    };
    
    async refresh(refreshToken) {
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
    
    async createUser(userData) {
        const { name, surname, email, phone, password } = userData;
        const user = new User({ name, surname, email, phone, password: await hashPassword(password) });
        await user.save();
        return user;
    };
 }


module.exports = new AuthService();