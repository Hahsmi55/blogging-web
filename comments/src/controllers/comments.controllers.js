const prisma = require('../config/prismaClient');
const asyncHandler = require('../utils/asyncHandler.utils');
const errorResponse = require('../utils/errorApi.utils');

const createComment = asyncHandler(async (req,res)=>{
    const {comment} = req.body;
    const postId = req.params.id;  
    const userId = req.user.id; 
    const Comment = await prisma.comment.create({
        data: {
            comment,
            postId,
            authorId: userId,
            createdAt: new Date(),
        }
    });
    res.status(201).json(Comment);
})

const deleteComment = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    const Comment = await prisma.comment.delete({
        where: {
            id: parseInt(id)
        }
    });
    res.status(200).json(Comment);
})

const updateComment = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    const {comment} = req.body;
    const userId = req.user.id;
    const oldComment = await prisma.comment.findUnique({
        where: {
            id: parseInt(id)
        }
    })
    if (oldComment.authorId !== req.user.id) {
        return next(new errorResponse('Unauthorized', 401));
    }
    if (!oldComment) {
        return next(new errorResponse('Comment is required', 400));
    }
    if(Date.now() - oldComment.createdAt > 60 * 60 * 1000) {
        return next(new errorResponse('You can not update this comment', 400));

    }
    const Comment = await prisma.comment.update({
        where: {
            id: parseInt(id)
        },
        data: {
            comment
        }
    });
    res.status(200).json(Comment);
});

exports.getAllComments = asyncHandler(async (req,res)=>{
    const postId = req.params.id;
    const Comments = await prisma.comment.findMany({
        where: {
            postId: parseInt(postId)    
        }
    });
    res.status(200).json(Comments);
})  

exports.deleteCommentByAdmin = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    const Comment = await prisma.comment.delete({
        where: {
            id: parseInt(id)
        }
    });
    res.status(200).json(Comment);
})  

module.exports = {
    createComment,
    deleteComment,
    updateComment,
    getAllComments, 
    deleteCommentByAdmin
}