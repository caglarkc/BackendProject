const User = require('../../models/User');
const Log = require('../../models/Log');
const textUtils = require('../../utils/textUtils');
const Seller = require('../../models/Seller');
const Admin = require('../../models/Admin');
const authService = require('../../services/authService');
const ValidationError = require('../../utils/errors/ValidationError');
const AuthError = require('../../utils/errors/AuthError');
const NotFoundError = require('../../utils/errors/NotFoundError');
const errorMessages = require('../../config/errorMessages');
const { hashPassword, comparePassword } = require('../../utils/hashPassword');

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

// Change phone number checked
exports.changePhone = async (req, res) => {
    try {
        const newPhone = req.body.newPhone;
        textUtils.validatePhone(newPhone);

        const user = await authService.login(req.body);

        textUtils.validateDuplicate(user.phone, newPhone, 'Phone');
        const existingPhone = await User.findOne({ phone: newPhone });
        if (existingPhone) {
            throw new ValidationError(errorMessages.VALIDATION.DUPLICATE_PHONE);
        }

        user.phone = newPhone;
        await user.save();

        const log = new Log({ objectId: user._id,objectType: 'User', actionType: 'changePhone', ipAddress: req.ip });
        await log.save();

        res.json({ message: "Telefon numarası başarıyla değiştirildi." });
    } catch (error) {
        if (!(error instanceof ValidationError || error instanceof AuthError || error instanceof NotFoundError)) {
            error = new ValidationError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

// Change name checked
exports.changeName = async (req, res) => {
    try {
        const {newName, newSurname } = req.body;
        const user = await authService.login(req.body);

        textUtils.validateName(newName);
        textUtils.validateName(newSurname);
        textUtils.validateUser(user);
        textUtils.validateDuplicateTwo(user.name, user.surname, newName, newSurname, 'Name', 'Surname');

        console.log(user.name, newName, user.surname, newSurname);

        user.name = newName;
        user.surname = newSurname;
        await user.save();

        const log = new Log({ objectId: user._id, objectType: 'User', actionType: 'changeName', ipAddress: req.ip });
        await log.save();

        res.json({ message: "Ad ve soyad başarıyla değiştirildi." });
    } catch (error) {
        if (!(error instanceof ValidationError || error instanceof AuthError || error instanceof NotFoundError)) {
            error = new ValidationError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};
// Change password checked
exports.changePassword = async (req, res) => {
    try {
        const {password, newPassword } = req.body;
        const user = await authService.login(req.body);

        textUtils.validatePassword(newPassword);
        textUtils.validatePassword(password);
        textUtils.validateUser(user);
        textUtils.validateDuplicate(password, newPassword, 'Password');

        user.password = await hashPassword(newPassword);
        await user.save();

        const log = new Log({ objectId: user._id, objectType: 'User', actionType: 'changePassword', ipAddress: req.ip });
        await log.save();

        res.json({ message: "Şifre başarıyla değiştirildi." });
    } catch (error) {
        if (!(error instanceof ValidationError || error instanceof AuthError || error instanceof NotFoundError)) {
            error = new ValidationError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};
// Change email checked
exports.changeEmail = async (req, res) => {
    try {
        const { newEmail } = req.body;
        const user = await authService.login(req.body);

        textUtils.validateEmail(newEmail);
        textUtils.validateUser(user);
        textUtils.validateDuplicate(user.email, newEmail, 'Email');

        const existingEmail = await User.findOne({ email: newEmail });
        if (existingEmail) {
            throw new ValidationError(errorMessages.VALIDATION.DUPLICATE_EMAIL);
        }

        user.email = newEmail;
        await user.save();

        const log = new Log({ objectId: user._id, objectType: 'User', actionType: 'changeEmail', ipAddress: req.ip });
        await log.save();

        res.json({ message: "Email başarıyla değiştirildi." });
    } catch (error) {
        if (!(error instanceof ValidationError || error instanceof AuthError || error instanceof NotFoundError)) {
            error = new ValidationError(error.message);
        }
        res.status(error.statusCode).json({ error: error.message });
    }
};

// Get profile checked
exports.getProfile = async (req, res) => {
    try {
        const user = await authService.login(req.body);
        const log = new Log({ objectId: user._id, objectType: 'User', actionType: 'getProfile', ipAddress: req.ip });
        await log.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete profile checked
exports.deleteProfile = async (req, res) => {
    try {
        const user = await authService.login(req.body);
        await User.findByIdAndDelete(user._id);

        const log = new Log({ objectId: user._id, objectType: 'User', actionType: 'deleteProfile', ipAddress: req.ip });
        await log.save();

        res.json({ message: "Kullanıcı başarıyla silindi." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
