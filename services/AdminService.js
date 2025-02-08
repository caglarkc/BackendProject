const { createLog, createLogWithDetails } = require('./LogService');
const User = require('../models/User');
const BaseService = require('./BaseService');

class AdminService extends BaseService {

    async changeRole(userId,role) {
        const user = await User.findById(userId);
        textUtils.validateUser(user);
        textUtils.validateInput(role, 'Role');

        // User verilerini kopyala
        const userData = {
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            password: user.password,
            addresses: user.addresses,
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

        await createLogWithDetails(null,
            "Admin",
            "changeRole",
            {
                userId: userId,
                role: role
            }
        );

        const message = "Kullanıcı rolü başarıyla " + role + " olarak değiştirildi.";

        return message;
    }

    async getAllUsers() {
        const users = await User.find();
        //butun userları formatla
        const formattedUsers = users.map(user => this._formatUserResponse(user));
        await createLog(
            null,
            "Admin",
            "getAllUsers"
        );
    
        return formattedUsers;
    }

    async getUser(userId) {
        const user = await User.findById(userId);
        await createLog(
            null,
            "Admin",
            "getUser",
            {
                userId: userId
            }
        );
        return this._formatUserResponse(user);
    }

    async deleteUser(userId) {
        await User.findByIdAndDelete(userId);
        await createLogWithDetails(
            null,
            "Admin",
            'deleteUser',
            {
                userId: userId
            }
        );
        return { message: "Kullanıcı başarıyla silindi." };
    }
}

module.exports = new AdminService();