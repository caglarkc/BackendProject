const User = require('../../models/User');
const Log = require('../../models/Log');
const textUtils = require('../../utils/textUtils');
const { hashPassword, comparePassword } = require('../../utils/hashPassword');
const { ValidationError, AuthError, NotFoundError } = require('../../utils/errors');
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
            }
        }
    });
};

// Register new user
exports.register = async (req, res) => {
    try {
        const { name, surname, email, phone, password, confirmPassword } = req.body;
        
        if(password !== confirmPassword) {
            throw new ValidationError(errorMessages.VALIDATION.PASSWORDS_NOT_MATCH);
        }
        
        // Validation checks
        textUtils.validateName(name);
        textUtils.validateName(surname);
        textUtils.validateEmail(email);
        textUtils.validatePhone(phone);
        textUtils.validatePassword(password);
        
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
        
        const log = new Log({ userId: user._id, actionType: 'register' });
        await log.save();
        
        res.status(201).json(user);
    } catch (error) {
        if (!(error instanceof ValidationError)) {
            error = new ValidationError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { data, password } = req.body;
        
        if(!data || !password) {
            throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
        }

        let user;
        if(data.includes('@')) {
            user = await User.findOne({ email: data });
        } else {
            user = await User.findOne({ phone: data });
        }
        
        if(!user) {
            throw new AuthError(errorMessages.AUTH.INVALID_CREDENTIALS);
        }
        
        if(!comparePassword(password, user.password)) {
            throw new AuthError(errorMessages.AUTH.WRONG_PASSWORD);
        }
        
        const log = new Log({ userId: user._id, actionType: 'login' });
        await log.save();
        
        res.status(200).json({ message: "Giriş başarılı.", user });
    } catch (error) {
        if (!(error instanceof AuthError || error instanceof ValidationError)) {
            error = new AuthError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

// Logout user
exports.logout = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if(!userId) {
            throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
        }

        const user = await User.findById(userId);
        if(!user) {
            throw new NotFoundError(errorMessages.NOT_FOUND.USER);
        }

        const log = new Log({ userId: user._id, actionType: 'logout' });
        await log.save();
        
        res.status(200).json({ message: "Çıkış başarılı." });
    } catch (error) {
        if (!(error instanceof NotFoundError || error instanceof ValidationError)) {
            error = new AuthError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { data } = req.body;
        
        if(!data) {
            throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
        }

        let user;
        if(data.includes('@')) {
            user = await User.findOne({ email: data });
        } else {
            user = await User.findOne({ phone: data });
        }
        
        if(!user) {
            throw new NotFoundError(errorMessages.NOT_FOUND.USER);
        }
        
        const log = new Log({ userId: user._id, actionType: 'forgotPassword' });
        await log.save();
        
        if(user.email) {
            res.status(200).json({ message: "Şifre sıfırlama e-postası gönderildi." });
        } else {
            res.status(200).json({ message: "Şifre sıfırlama SMS gönderildi." });
        }
    } catch (error) {
        if (!(error instanceof NotFoundError || error instanceof ValidationError)) {
            error = new AuthError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

