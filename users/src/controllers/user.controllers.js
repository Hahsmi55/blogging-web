const error = require('../utils/errorApi');
const asyncHandler = require('../utils/asyncHandler');
const transporter = require('../config/nodemailer');  
const oidClient = require('../config/openid');
const redisClient = require('../config/redisClient');
const stateGenerator = require('../utils/stateGen');
const otp = require('../utils/otp');
const authFuncs = require('../utils/authFuncs');
const prisma = require('../config/prismaClient');

exports.registerUser = asyncHandler(async (req, res, next) => {
    const { fname, lname, email, password, role } = req.body;
    const existingUser = await prisma.user.findUnique({ 
        where: {
            email: email,
        }
    });     
    if (existingUser) { 
        return next(new error('User already exists', 400));
    };
    const hashedPassword = await authFuncs.hashPassword(password);
    await prisma.user.create({
        data: {
            first_name: fname,
            last_name: lname,
            email : email,
            password : hashedPassword,
            role : role
        }   
    }); 
    return res.status(201).json({ message: 'User registered successfully' });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (!user) {
        return next(new error('User not found', 404));
    }
    const isPasswordMatch = await authFuncs.comparePassword(password, user.password);
    if (!isPasswordMatch) {
        return next(new error('Invalid password', 401));
    }
    const accessToken = authFuncs.generateAccessToken(user);
    const refreshToken = authFuncs.generateRefreshToken(user);
    await prisma.refreshToken.create({
        data: {
            hash: refreshToken,
            expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
    });
    req.headers['Authorization'] = `Bearer ${accessToken}`;
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,   
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.status(200).json({ accessToken, refreshToken });
}); 

exports.logoutUser = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        await prisma.refreshToken.deleteMany({
            where: {
                hash: refreshToken
            }
        });
    }
    req.headers['Authorization'] = null;
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'User logged out successfully' });
}); 

exports.updatePass = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    }); 
    const isPasswordMatch = await authFuncs.comparePassword(oldPassword, user.password);
    if (!isPasswordMatch) {
        return next(new error('Invalid old password', 401));
    }
    const hashedPassword = await authFuncs.hashPassword(newPassword);
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: hashedPassword
        }
    });
    return res.status(200).json({ message: 'Password updated successfully' });
});

exports.sendOtp = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
        where: {    
            email: email
        }
    }); 
    if (!user) { 
        return next(new error('User not found', 404));  
    }   
    const generatedOtp = otp.generateOtp();
    await prisma.otp.create({
        data: { 
            otp : generatedOtp,
            expiresAt : new Date(Date.now() + 2 * 60 * 1000)
        }
    }); 
    const mailOptions = {
        from: 'me@example.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${generatedOtp}. It is valid for 2 minutes.`
    };
    const info = await transporter.sendMail(mailOptions);
    if (!info.accepted.length) {
        return next(new error('Failed to send OTP email', 500));
    }
    return res.status(200).json({ message: 'OTP sent to email' });
});

exports.verifyOtp = asyncHandler(async (req, res, next) => {
    const { otp: userOtp } = req.body;
    const storedOtp = await prisma.otp.findFirst({
        where: {
            otp: userOtp
        }
    });     
    if (!storedOtp) {
        return next(new error('Invalid OTP', 400));
    }
    if (new Date() > storedOtp.expiresAt) { 
        return next(new error('OTP expired', 400));
    }   
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    }); 
    if (!user) {    
        return next(new error('User not found', 404));
    }   
    return res.status(200).json({ message: 'OTP verified successfully' });  
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;      
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
        where: {
            password: oldPassword
        }
    });
    if (!user) {
        return next(new error('Old password is incorrect', 401));
    }
    const hashedPassword = await authFuncs.hashPassword(newPassword);
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: hashedPassword
        }
    });
    return res.status(200).json({ message: 'Password updated successfully' });
});

exports.getUserProfile = asyncHandler(async (req, res, next) => {   
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    return res.status(200).json(user);
}); 

exports.refreshToken = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return next(new error('No refresh token provided', 401));
    }
    const storedToken = await prisma.refreshToken.findFirst({
        where: {
            hash: refreshToken
        }
    });
    if (!storedToken) {
        return next(new error('Invalid refresh token', 401));
    }
    if (new Date() > storedToken.expireAt) {    
        return next(new error('Refresh token expired', 401));
    }   
    const user = await authFuncs.verifyRefreshToken(refreshToken);
    const newAccessToken = authFuncs.generateAccessToken(user);
    const newRefreshToken = authFuncs.generateRefreshToken(user);
    await prisma.refreshToken.update({
        where: {
            id: storedToken.id
        },
        data: {
            hash: newRefreshToken,
            expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }); 
    req.headers['authorization'] = `Bearer ${newAccessToken}`;
    return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});

exports.loginWithGoogle = asyncHandler(async (req, res, next) => {
    const { client, generators} = await oidClient;
    const state = stateGenerator(16);
    const codeVerifier = generators.codeVerifier(); 
    const codeChallenge = generators.codeChallenge(codeVerifier);
    await redisClient.set(state, codeVerifier);  
    const authorizationUrl = client.authorizationUrl({
        scope: 'openid email profile',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: state,
    });
    return res.status(200).json({ authorizationUrl });
});

exports.googleCallback = asyncHandler(async (req, res, next) => {
    const { client } = await oidClient;
    const params = client.callbackParams(req);
    const codeVerifier = await redisClient.get(params.state);
    if (!codeVerifier) {
        return next(new error('Invalid state parameter', 400));
    }
    const tokenSet = await client.callback(process.env.REDIRECT_URI, params, { code_verifier: codeVerifier });
    const userInfo = await client.userinfo(tokenSet.access_token);
    let user = await prisma.user.findUnique({
        where: {    
            email: userInfo.email
        }
    });
    if (!user) {
        user = await prisma.user.create({
            data: {
                first_name: userInfo.given_name,
                last_name: userInfo.family_name,
                email: userInfo.email
            }
        });
    }
    const accessToken = authFuncs.generateAccessToken(user);
    const refreshToken = authFuncs.generateRefreshToken(user);      
    await prisma.refreshToken.create({
        data: {
            hash: refreshToken,
            expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
    });
    req.headers['authorization'] = `Bearer ${accessToken}`;
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.status(200).json({ message: 'User logged in with Google successfully' });
});  

exports.getAllUsers = asyncHandler(async (req, res, next) => {   
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const userId = req.params.id;
    await prisma.user.delete({
        where: {
            id: userId
        }
    });
    return res.status(200).json({ message: 'User deleted successfully' });
});

exports.createAdmin = asyncHandler(async (req, res, next) => {
    const { fname, lname, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });    
    if (existingUser) {
        return next(new error('User already exists', 400));
    }
    const hashedPassword = await authFuncs.hashPassword(password);
    const newAdmin = await prisma.user.create({
        data: {
            first_name: fname,
            last_name: lname,
            email: email,
            password: hashedPassword,
            role: 'ADMIN'
        }
    });
    return res.status(200).json(newAdmin);  
}); 