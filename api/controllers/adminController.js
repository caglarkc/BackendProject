const AdminService = require('../../services/AdminService');
const BaseController = require('./BaseController');

class AdminController extends BaseController {

    async changeRole(req, res, next) {
        try {
            const message = await AdminService.changeRole(req.body.userId,req.body.role);

            res.json(message);
        } catch (error) {
            next(error);
        }
    };
    
    async getAllUsers(req, res, next) {
        try {
            const formattedUsers = await AdminService.getAllUsers();
            res.json(formattedUsers);
        } catch (error) {
            next(error);
        }
    };
    
    async getUser(req, res, next) {
        try {
            const user = await AdminService.getUser(req.body.userId);
            res.json(user);
        } catch (error) {
            next(error);
        }
    };
    
    async deleteUser(req, res, next) {
        try {
            const message = await AdminService.deleteUser(req.body.userId);
    
            res.json(message);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AdminController();

