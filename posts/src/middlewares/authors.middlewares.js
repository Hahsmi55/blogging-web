const axios = require('axios');

const authorMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {

        const user = await axios.get(`http://localhost:3000/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user.data;
        // if (req.user.role !== 'author') {
        //     return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
        // }
        next();       
    } catch (error) {
        return res.status(401).json({ message:  "Server error" });
    }
};

module.exports = authorMiddleware;