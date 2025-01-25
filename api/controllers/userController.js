const User = require('../../models/User');
const Log = require('../../models/Log');
const textUtils = require('../../utils/textUtils');
const Seller = require('../../models/Seller');
const Admin = require('../../models/Admin');
const authService = require('../../services/authService');
const { ValidationError, AuthError, NotFoundError } = require('../../utils/errors');
const errorMessages = require('../../config/errorMessages');

//****************Admin methods****************
exports.changeRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        const user = await User.findById(userId);

        if(!userId) {
            return res.status(400).json({ error: "Kullanıcı ID gereklidir." });
        }
        if(!role) {
            return res.status(400).json({ error: "Rol gereklidir." });
        }
        if(!user) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı." });
        }

        // User verilerini kopyala
        const userData = {
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            password: user.password,
            address: user.address,
            defaultAddress: user.defaultAddress
        };

        // Önce yeni rol kaydını oluştur
        if(role === "seller") {
            const seller = new Seller(userData);
            await seller.save();
        } else if(role === "admin") {
            const admin = new Admin(userData);
            await admin.save();
        }

        // Sonra user'ı sil
        await User.findByIdAndDelete(userId);

        const log = new Log({ userId: userId, actionType: 'changeRole' });
        await log.save();
        
        res.json({ message: "Rol başarıyla değiştirildi." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if(!userId) {
            return res.status(400).json({ error: "Kullanıcı ID gereklidir." });
        }
        if(!user) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı." });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findByIdAndDelete(userId);
        if(!userId) {
            return res.status(400).json({ error: "Kullanıcı ID gereklidir." });
        }

        if (!user) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı." });
        }

        const log = new Log({ userId: user._id, actionType: 'deleteUser' });
        await log.save();

        res.json({ message: "Kullanıcı başarıyla silindi." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//***************User methods****************

exports.changePhone = async (req, res) => {
    try {
        const { userId, password, newPhone } = req.body;
        
        if(!userId || !password || !newPhone) {
            throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError(errorMessages.NOT_FOUND.USER);
        }

        if (!comparePassword(password, user.password)) {
            throw new AuthError(errorMessages.AUTH.WRONG_PASSWORD);
        }

        textUtils.validatePhone(newPhone);

        if(user.phone === newPhone) {
            throw new ValidationError("Yeni telefon numarası eski telefon numarası ile aynı olamaz.");
        }

        const existingPhone = await User.findOne({ phone: newPhone });
        if (existingPhone) {
            throw new ValidationError(errorMessages.VALIDATION.DUPLICATE_PHONE);
        }

        user.phone = newPhone;
        await user.save();

        const log = new Log({ userId: user._id, actionType: 'changePhone' });
        await log.save();

        res.json({ message: "Telefon numarası başarıyla değiştirildi." });
    } catch (error) {
        if (!(error instanceof ValidationError || error instanceof AuthError || error instanceof NotFoundError)) {
            error = new ValidationError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

exports.changeName = async (req, res) => {
    try {
        const { userId, password, name, surname } = req.body;
        
        if(!userId || !password || !name || !surname) {
            throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
        }

        const user = await User.findById(userId);
        if(!user) {
            throw new NotFoundError(errorMessages.NOT_FOUND.USER);
        }

        if(!comparePassword(password, user.password)) {
            throw new AuthError(errorMessages.AUTH.WRONG_PASSWORD);
        }

        textUtils.validateName(name);
        textUtils.validateName(surname);

        if(user.name === name && user.surname === surname) {
            throw new ValidationError("Yeni ad ve soyad eski ad ve soyad ile aynı olamaz.");
        }

        user.name = name;
        user.surname = surname;
        await user.save();

        const log = new Log({ userId: user._id, actionType: 'changeName' });
        await log.save();

        res.json({ message: "Ad ve soyad başarıyla değiştirildi." });
    } catch (error) {
        if (!(error instanceof ValidationError || error instanceof AuthError || error instanceof NotFoundError)) {
            error = new ValidationError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        
        if(!userId || !currentPassword || !newPassword) {
            throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError(errorMessages.NOT_FOUND.USER);
        }

        if (!comparePassword(currentPassword, user.password)) {
            throw new AuthError(errorMessages.AUTH.WRONG_PASSWORD);
        }

        textUtils.validatePassword(newPassword);

        if(currentPassword === newPassword) {
            throw new ValidationError("Yeni şifre eski şifre ile aynı olamaz.");
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        const log = new Log({ userId: user._id, actionType: 'changePassword' });
        await log.save();

        res.json({ message: "Şifre başarıyla değiştirildi." });
    } catch (error) {
        if (!(error instanceof ValidationError || error instanceof AuthError || error instanceof NotFoundError)) {
            error = new ValidationError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

exports.changeEmail = async (req, res) => {
    try {
        const { userId, password, newEmail } = req.body;

        if(!userId || !password || !newEmail) {
            throw new ValidationError(errorMessages.VALIDATION.EMPTY_FIELD);
        }
        
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError(errorMessages.NOT_FOUND.USER);
        }

        if (!comparePassword(password, user.password)) {
            throw new AuthError(errorMessages.AUTH.WRONG_PASSWORD);
        }

        textUtils.validateEmail(newEmail);

        if(user.email === newEmail) {
            throw new ValidationError("Yeni email eski email ile aynı olamaz.");
        }

        const existingEmail = await User.findOne({ email: newEmail });
        if (existingEmail) {
            throw new ValidationError(errorMessages.VALIDATION.DUPLICATE_EMAIL);
        }

        user.email = newEmail;
        await user.save();

        const log = new Log({ userId: user._id, actionType: 'changeEmail' });
        await log.save();

        res.json({ message: "Email başarıyla değiştirildi." });
    } catch (error) {
        if (!(error instanceof ValidationError || error instanceof AuthError || error instanceof NotFoundError)) {
            error = new ValidationError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await authService.login(userId, password);
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await authService.login(userId, password);
        await User.findByIdAndDelete(userId);

        res.json({ message: "Kullanıcı başarıyla silindi." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
