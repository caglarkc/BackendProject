const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw new AuthError('Token bulunamadı');
        }

        const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
        if (!decoded) {
            throw new AuthError('Geçersiz token');
        }

        req.user = await User.findById(decoded.userId);
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};