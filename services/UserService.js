const User = require('../models/User');
const BaseService = require('./BaseService');
const { createLog } = require('./LogService');
const ValidationError = require('../utils/errors/ValidationError');
const { validateUser, validateLogin, validateChange } = require('../utils/textUtils');
const errorMessages = require('../config/errorMessages');
const { comparePassword, hashPassword } = require('../utils/hashPassword');

// Güvenli kullanıcı bilgilerini döndüren yardımcı fonksiyon
const _formatUserResponse = (user) => {
    return {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        defaultAddress: user.defaultAddress,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

class UserService extends BaseService {
    async getProfile() {
        const userId = await this.getUserId();
        const user = await validateUser(userId)
        .populate('addresses')
        .populate('defaultAddress');

        await createLog(userId, 'User', 'GET_PROFILE');
        return _formatUserResponse(user);
    }

    async deleteProfile(password) {
        const userId = await this.getUserId();
        await validateLoginCheck(userId, password);
        await User.findByIdAndDelete(userId);
        await createLog(userId, 'User', 'DELETE_PROFILE');
        return { message: "Profil başarıyla silindi." };

    }

    async changeEmail(newEmail, password) {
        const userId = await this.getUserId();
        const user = await validateChange(userId, password, newEmail, 'email');

        user.email = newEmail;
        await user.save();
        await createLog(userId, 'User', 'CHANGE_EMAIL');

        return { message: "Email başarıyla değiştirildi." };
    }

    async changePassword(currentPassword, newPassword) {
        const userId = await this.getUserId();
        const user = await validateChange(userId, currentPassword, newPassword, 'password');

        user.password = await hashPassword(newPassword);
        await user.save();
        await createLog(userId, 'User', 'CHANGE_PASSWORD');

        return { message: "Şifre başarıyla değiştirildi." };
    }

    async changePhone(newPhone, password) {
        const userId = await this.getUserId();
        const user = await validateChange(userId, password, newPhone, 'phone');

        user.phone = newPhone;
        await user.save();
        await createLog(userId, 'User', 'CHANGE_PHONE');

        return { message: "Telefon numarası başarıyla değiştirildi." };
    }

    async changeName(newName, password) {
        const userId = await this.getUserId();
        const user = await validateChange(userId, password, newName, 'name');


        user.name = newName;
        await user.save();
        await createLog(userId, 'User', 'CHANGE_NAME');

        return { message: "İsim başarıyla değiştirildi." };
    }

    async changeSurname(newSurname, password) {
        const userId = await this.getUserId();
        const user = await validateChange(userId, password, newSurname, 'surname');

        user.surname = newSurname;
        await user.save();
        await createLog(userId, 'User', 'CHANGE_SURNAME');
    }
}

module.exports = new UserService();