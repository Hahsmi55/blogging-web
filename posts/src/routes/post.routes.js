const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/post.controller');
const authorMiddleware = require('../middlewares/authors.middlewares');
const upload = require('../middlewares/multer.middleware');

router.use(authorMiddleware);

// author routes
router.post('/create', upload.single('image'), postControllers.createPost);
router.delete('/:id', postControllers.deletePost);
router.put('/:id', upload.single('image'), postControllers.updatePost);
router.get('/author', postControllers.getAllPostsAuthor);

//admin routes  
router.get('/all', postControllers.getAllPostsAdmin);
router.delete('/delete/:id', postControllers.deletePostAdmin);


//user routes
router.get('/index', postControllers.getAllPostsUser);
router.get('/getPost/:id', postControllers.getPostById);
router.get('/author/:authorId', postControllers.getPostsByAuthor);
router.get('/search', postControllers.searchPosts);


module.exports = router;