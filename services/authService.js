const User = require('../models/User');
const textUtils = require('../utils/textUtils');
const { hashPassword, } = require('../utils/hashPassword');
const AuthError = require('../utils/errors/AuthError');
const errorMessages = require('../config/errorMessages');

const { createLog } = require('./LogService');
const BaseService = require('./BaseService');
const { getRequestContext } = require('../middleware/requestContext');
const TokenService = require('../services/TokenService');

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
        await textUtils.validateRegister(userData);
        
        const user = await this.createUser({ 
            name: userData.name, 
            surname: userData.surname, 
            email: userData.email, 
            phone: userData.phone, 
            password: userData.password
        });

        await createLog(user._id, 'User', 'REGISTER');
        
        return {
            user: _formatUserResponse(user),
            message: "Kullanıcı başarıyla oluşturuldu."
        };
    }
    
    async login(loginData, token = null) {
        // Token kontrolü
        if (token) {
            try {
                const { decoded } = await TokenService.verifyAndDecodeToken(token);
                if (decoded) {
                    throw new AuthError(errorMessages.AUTH.AUTH.ALREADY_LOGGED_IN);
                }
            } catch (error) {
                if (error.message === errorMessages.AUTH.AUTH.ALREADY_LOGGED_IN) {
                    throw error;
                }
                // Token geçersizse devam et
            }
        }

        const user = await textUtils.validateLogin(loginData);

        const { accessToken, refreshToken } = TokenService.createTokenPair(user._id);
        
        // Refresh token'ı veritabanına kaydet ve güncel kullanıcı bilgilerini al
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { 
                $set: {
                    refreshToken,
                    isLoggedIn: true,
                    lastLoginAt: new Date()
                }
            },
            { new: true }
        );

        // RequestContext'e userId'yi kaydet
        const context = getRequestContext();
        context.setUserId(user._id);
        context.setData('userRole', user.role);
        context.setData('userName', user.name);
        context.setData('userEmail', user.email);
        context.setData('userPhone', user.phone);

        await createLog(user._id, 'User', 'LOGIN');
        
        return { 
            user: _formatUserResponse(updatedUser), 
            accessToken, 
            refreshToken 
        };
    }
    
    async logout(token) {
        if (!token) {
            throw new AuthError(errorMessages.AUTH.TOKEN_MISSING);
        }

        // Token'ı doğrula ve userId'yi al
        const { decoded } = await TokenService.verifyAndDecodeToken(token);
        if (!decoded) {
            throw new AuthError(errorMessages.AUTH.TOKEN_INVALID);
        }

        // Kullanıcı validasyonu ve oturum kontrolü
        const user = await textUtils.validateLogout(decoded.userId);

        // Token'ı blacklist'e ekle
        await TokenService.blacklistToken(token, user._id, 'LOGOUT');

        // RequestContext'ten kullanıcı bilgilerini temizle
        const context = getRequestContext();
        context.setUserId(null);
        context.setData('userRole', null);
        context.setData('userName', null);
        context.setData('userEmail', null);
        context.setData('userPhone', null);

        // Log oluştur
        await createLog(user._id, 'User', 'LOGOUT');

        // Refresh token'ı ve diğer oturum bilgilerini temizle
        await User.findByIdAndUpdate(user._id, {
            $set: {
                refreshToken: null,
                lastLogoutAt: new Date(),
                isLoggedIn: false
            }
        });

        return { success: true, message: "Çıkış başarılı." };
    }
    
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
        const user = new User({ 
            name, 
            surname, 
            email, 
            phone, 
            password: await hashPassword(password) 
        });

        await user.save();
        return user;
    }
}

module.exports = new AuthService();