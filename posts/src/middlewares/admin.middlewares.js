const axios = require('axios');

const adminMiddleware = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const admin = axios.get(`http://localhost:3005/admin/profile`, {
            headers: {
                Authorization: token
            }
        });
        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.admin = admin.data;
        if (req.admin.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
        }
        next();       
    } catch (error) {
        return res.status(401).json({ message:  "Server error" });
    }
};

module.exports = adminMiddleware;