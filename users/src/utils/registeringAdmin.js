const prisma = require('../prisma/prismaClient');
const authFuncs = require('./authFuncs');

exports.registerAdmin = async () => {
    
    const existingAdmin = await prisma.user.findFirst({
        where: {
            email: process.env.ADMIN_EMAIL
        }
    });

    if (existingAdmin) {
        console.log('Admin user already exists.');
        return; 
    }   
    const hashedPassword = await authFuncs.hashPassword(process.env.ADMIN_PASSWORD);

    const newAdmin = await prisma.user.create({
        data: {
            email: process.env.ADMIN_EMAIL, 
            password: hashedPassword,
            role: 'ADMIN'
        }
    });
    return newAdmin;
};

module.exports = {
    registerAdmin
};  