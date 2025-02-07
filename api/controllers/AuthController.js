const AuthService = require('../../services/AuthService');
const BaseController = require('./BaseController');

class AuthController extends BaseController {
    // Register new user checked
    async register(req, res, next) {
        try {
            const user = await AuthService.register(req.body);
            
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }

// Login user checked
    async login(req, res, next) {
    try {
        const user = await AuthService.login(req.body);
        
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
        next(error);
    }
};

// Logout user checked
    async logout(req, res, next) {
        try {
            const result = await AuthService.logout(req.body);

        // HTTP'ye özgü işlemler controller'da
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Forgot password checked
    async forgotPassword(req, res, next) {
        try {
            const result = await AuthService.forgotPassword(req.body);
            
        res.status(200).json(result);
    } catch (error) {
            next(error);
        }
    }

// Refresh token endpoint
    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            const result = await AuthService.refresh(refreshToken);
            
        res.cookie('accessToken', result.accessToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 15 * 60 * 1000 
        });

        res.status(200).json({ message: "Access token yenilendi.", accessToken: result.accessToken });
    } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();




