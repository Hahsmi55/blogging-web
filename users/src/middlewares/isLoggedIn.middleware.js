const authFuncs = require('../utils/authFuncs');

const isLoggedIn = (req, res, next) => {
    const  token =  req.headers['authorization'].split(' ')[1] ;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }   
    try {
        const decoded = authFuncs.verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = isLoggedIn;    