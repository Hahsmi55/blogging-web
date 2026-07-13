const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const isLoggedIn = require('../middlewares/isLoggedIn.middleware');
const adminMiddleware = require('../middlewares/admin.middlewares'); 

// users routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', isLoggedIn, userController.logoutUser);
router.put('/update-password', isLoggedIn, userController.updatePass);
router.post('/refresh-token', userController.refreshToken);
router.post('/verify-otp', userController.verifyOtp);
router.post('/send-otp', userController.sendOtp);
router.post('/forgot-password', userController.forgotPassword);
router.get('/profile', isLoggedIn, userController.getUserProfile); 
router.post('/login-google', userController.loginWithGoogle);   
router.post('/callback-google', userController.googleCallback);

// admin routes
router.get('/all', isLoggedIn, adminMiddleware, userController.getAllUsers);
router.delete('/delete/:id', isLoggedIn, adminMiddleware, userController.deleteUser);
router.post('/create-admin', isLoggedIn, adminMiddleware, userController.createAdmin);

module.exports = router;