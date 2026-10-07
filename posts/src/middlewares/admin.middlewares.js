const axios = require('axios');

const adminMiddleware = async (req, res, next) => {
    
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const admin = await axios.get(`http://localhost:3000/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.admin = admin.data;
        if (req.admin.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
        }
        next();       
    } catch (error) {
        return res.status(401).json({ message:  "Server error" });
    }
};

module.exports = adminMiddleware;