const express = require('express');
const router = express.Router();     
const adminController = require('../controllers/admin.controllers');
const adminMiddleware = require('../middlewares/admin.middlewares');

router.use(adminMiddleware);

router.get('/post/all', adminController.getAllPosts);
router.delete('/post/delete/:id', adminController.deletePost);
router.get('/user/all', adminController.getAllUsers);
router.delete('/user/delete/:id', adminController.deleteUser);  
router.get('/comment/all', adminController.getAllComments);
router.delete('/comment/delete/:id', adminController.deleteCommentByAdmin);
router.post('/users/create-admin', adminController.createAdminUser);
router.get('/admin/tags/all', adminController.getAllTags);
router.post('/admin/tags/create', adminController.createTag);
router.delete('/admin/tags/delete/:id', adminController.deleteTag);
router.put('/admin/tags/update/:id', adminController.updateTag);


module.exports = router;