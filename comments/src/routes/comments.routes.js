const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments.controllers');
const adminMiddleware = require('../middlewares/admin.middlewares');
const isLoggedInMiddleware = require('../middlewares/isLoggedIn.middleware');

//user routes
router.post('/create', commentsController.createComment);
router.delete('/:id', commentsController.deleteComment);
router.put('/:id', commentsController.updateComment);

//admin routes
router.get('/all', adminMiddleware, commentsController.getAllComments);
router.delete('/delete/:id', adminMiddleware, commentsController.deleteCommentByAdmin);


module.exports = router;



