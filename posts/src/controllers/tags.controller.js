const prisma = require('../config/prismaClient');
const asyncHandler = require('../utils/asyncHandler.utils');
const errorResponse = require('../utils/errorApi.utils');

exports.getAllTags = asyncHandler(async (req, res, next) => {   
    const tags = await prisma.tag.findMany();
    res.status(200).json({ success: true, data: tags });
});

exports.createTag = asyncHandler(async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return next(new errorResponse('Tag name is required', 400));
    }

    const existingTag = await prisma.tag.findUnique({ where: { name } });    

    if (existingTag) {
        return next(new errorResponse('Tag already exists', 400));  
    }
    const tag = await prisma.tag.create({ data: { name } });    
    res.status(201).json({ success: true, data: tag });
});

exports.deleteTag = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({ where: { id: parseInt(id) } });   
    if (!tag) {
        return next(new errorResponse('Tag not found', 404));
    }

    await prisma.tag.delete({ where: { id: parseInt(id) } });    
    res.status(200).json({ success: true, data: {} });
});

exports.updateTag = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return next(new errorResponse('Tag name is required', 400));
    }

    const tag = await prisma.tag.findUnique({ where: { id: parseInt(id) } });   
    if (!tag) {
        return next(new errorResponse('Tag not found', 404));
    }

    const updatedTag = await prisma.tag.update({
        where: { id: parseInt(id) },
        data: { name },
        updatedAt: new Date()   
    });    
    res.status(200).json({ success: true, data: updatedTag });
}); 
