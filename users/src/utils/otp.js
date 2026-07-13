const crypto = require('crypto');       

exports.generateOTP = () => {    
    return crypto.randomBytes(6).toString('hex');
};  

exports.verifyOTP = (inputOTP, actualOTP) => {
    return inputOTP === actualOTP;
};
