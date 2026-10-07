const authFuncs = require('../utils/authFuncs');

const adminMiddleware = (req, res, next) => {   
    
    const token =  req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }   
    try {
        const decoded = authFuncs.verifyAccessToken(token);
        req.user = decoded;
        if (decoded.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: User is not an admin' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};  

module.exports = adminMiddleware;