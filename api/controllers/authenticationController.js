const User = require('../../models/User');
const Log = require('../../models/Log');
const textUtils = require('../../utils/textUtils');
const ValidationError = require('../../utils/errors/ValidationError');
const AuthError = require('../../utils/errors/AuthError');
const NotFoundError = require('../../utils/errors/NotFoundError');
const errorMessages = require('../../config/errorMessages');
const authService = require('../../services/authService');

// Get endpoints
exports.getEndpoints = (req, res) => {
    res.json({ 
        message: 'Authentication API çalışıyor',
        endpoints: {
            register: {
                post: {
                    url: '/register',
                    body: { 
                        "name": "Ali Çağlar",
                        "surname": "Koçer",
                        "email": "alicaglarkocer@gmail.com",
                        "phone": "5521791303",
                        "password": "123456",
                        "confirmPassword": "123456"
                    }
                }
            },
            login: {
                post: {
                    url: '/login',
                    body: {
                        "email": "alicaglarkocer@gmail.com",
                        "password": "123456"
                    }
                }
            },
            logout: {
                post: {
                    url: '/logout',
                }
            },
            forgotPassword: {
                post: {
                    url: '/forgotPassword',
                    description: "Email veya telefon numarasından birini göndermeniz yeterlidir.",
                    body: {
                        "email": "alicaglarkocer@gmail.com (opsiyonel)",
                        "phone": "5521791303 (opsiyonel)"
                    }
                }
            },
            resetPassword: {
                post: {
                    url: '/resetPassword',
                    body: {
                        "password": "123456"
                    }
                }
            },
            refresh: {
                post: {
                    url: '/refresh',
                }
            }
        }
    });
};

// Register new user checked
exports.register = async (req, res) => {
    try {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const user = await authService.register(req.body, ip);
        
        res.status(201).json(user);
    } catch (error) {
        if (!(error instanceof ValidationError)) {
            error = new ValidationError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

// Login user checked
exports.login = async (req, res) => {
    try {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const user = await authService.login(req.body, ip);
        
        res.cookie('accessToken', user.accessToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 15 * 60 * 1000 
        });
        res.cookie('refreshToken', user.refreshToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        

        res.status(200).json({ message: "Giriş başarılı.", user });
    } catch (error) {
        if (!(error instanceof AuthError || error instanceof ValidationError)) {
            error = new AuthError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

// Logout user checked
exports.logout = async (req, res) => {
    try {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const result = await authService.logout(req.body, ip);

        // HTTP'ye özgü işlemler controller'da
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json(result);
    } catch (error) {
        if (!(error instanceof NotFoundError || error instanceof ValidationError)) {
            error = new AuthError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

// Forgot password checked
exports.forgotPassword = async (req, res) => {
    try {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const result = await authService.forgotPassword(req.body, ip);
        
        res.status(200).json(result);
    } catch (error) {
        if (!(error instanceof NotFoundError || error instanceof ValidationError)) {
            error = new AuthError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

// Refresh token endpoint
exports.refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const result = await authService.refresh(refreshToken);
        
        res.cookie('accessToken', result.accessToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 15 * 60 * 1000 
        });

        res.status(200).json({ message: "Access token yenilendi.", accessToken: result.accessToken });
    } catch (error) {
        if (!(error instanceof AuthError)) {
            error = new AuthError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

