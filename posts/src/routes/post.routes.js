const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/post.controller');
const authorMiddleware = require('../middlewares/authors.middlewares');

router.use(authorMiddleware);

// author routes
router.post('/create', postControllers.createPost);
router.delete('/:id', postControllers.deletePost);
router.put('/:id', postControllers.updatePost);
router.get('/author', postControllers.getAllPostsAuthor);
router.get("/presigned-url", postControllers.getPreSignedUrl);

//admin routes  
router.get('/all', postControllers.getAllPostsAdmin);
router.delete('/delete/:id', postControllers.deletePostAdmin);


//user routes
router.get('/index', postControllers.getAllPostsUser);
router.get('/getPost/:id', postControllers.getPostById);
router.get('/author/:authorId', postControllers.getPostsByAuthor);
router.get('/search', postControllers.searchPosts);


module.exports = router;