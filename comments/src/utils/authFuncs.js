const jwt = require('jsonwebtoken');

exports.verifyAccessToken = (token) => {    
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    verifyAccessToken
};