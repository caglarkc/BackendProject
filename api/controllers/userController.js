const UserService = require('../../services/UserService');
const BaseController = require('./BaseController');

class UserController extends BaseController {
    
    async getProfile(req, res, next) {
        try {
            const user = await UserService.getProfile();
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async deleteProfile(req, res, next) {
        try {
            const { password } = req.body;
            const result = await UserService.deleteProfile(password);
            res.json(result);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: { message: error.message } });
            }
            next(error);
        }
    }
    
    async changeEmail(req, res, next) {
        try {
            const result = await UserService.changeEmail(req.body);
            res.json(result);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: { message: error.message } });
            }
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            const result = await UserService.changePassword(currentPassword, newPassword);
            res.json(result);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: { message: error.message } });
            }
            next(error);
        }
    }

    async changePhone(req, res, next) {
        try {
            const { newPhone, password } = req.body;
            const result = await UserService.changePhone(newPhone, password);
            res.json(result);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: { message: error.message } });
            }
            next(error);
        }
    }

    async changeName(req, res, next) {
        try {
            const { newName, password } = req.body;
            const result = await UserService.changeName(newName, password);
            res.json(result);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: { message: error.message } });
            }
            next(error);
        }
    }

    async changeSurname(req, res, next) {
        try {
            const { newSurname, password } = req.body;
            const result = await UserService.changeSurname(newSurname, password);
            res.json(result);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: { message: error.message } });
            }
            next(error);
        }
    }

}

module.exports = new UserController();
