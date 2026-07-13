const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tags.controller');
const adminMiddleware = require('../middlewares/admin.middlewares'); 

router.use(adminMiddleware);

router.get('/all', tagsController.getAllTags);
router.post('/create',  tagsController.createTag);
router.delete('/:id', tagsController.deleteTag);
router.put('/:id', tagsController.updateTag);

module.exports = router;