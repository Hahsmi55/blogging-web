const axios = require('axios');
const prisma = require('../config/prismaClient');
const asyncHandler = require('../utils/asyncHandler.utils');
const errorResponse = require('../utils/errorApi.utils');
const { getPresignedUrl } = require('../utils/presignedurl.utils');
const { deleteObject } = require('../utils/deleteObject.utils');

exports.createPost = asyncHandler(async (req, res, next) => {
  const { title, content, tagsIds, key } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return next(new errorResponse('Title and content are required', 400));
  }

  const post = await prisma.posts.create({
    data: {
      subject: title,
      content,
      authorId: userId,
      key
    },
  });

  tagsIds.forEach(async (tagsId) => {  
    await prisma.postsTags.create({
      data: {
        postId: post.id,
        tagsId,
      },
    });
  }); 

  res.status(201).json({ success: true, data: post });
});

exports.deletePost = asyncHandler(async (req,res,next) =>{
  const id = req.params.id;
  const userId = req.user.id;

  const post = await prisma.posts.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post) {
    return next(new errorResponse('Post not found', 404));
  }

  if (post.authorId !== userId) {
    return next(new errorResponse('Unauthorized', 401));
  }

  await prisma.posts.delete({
    where: { id: parseInt(id) },
  });

  await deleteObject(post.key);

  res.status(200).json({ success: true, message: 'Post deleted successfully' });  
  
})

exports.updatePost = asyncHandler(async (req,res,next) =>{    
  const id = req.params.id;
  const userId = req.user.id;

  const post = await prisma.posts.findUnique({
    where: { id: parseInt(id) },
  });   

  if (!post) {
    return next(new errorResponse('Post not found', 404));  
  }

  if (post.authorId !== userId) {
    return next(new errorResponse('Unauthorized', 401));
  }   
  const { title, content, tagsIds, key } = req.body; 

  const updatedPost = await prisma.posts.update({
    where: { id: parseInt(id) },
    data: {
      subject: title || post.subject,
      content: content || post.content,
      key : key || post.key,
    },
  });

  if (tagsIds) {
    await prisma.postsTags.deleteMany({
      where: { postId: parseInt(id) },
    });

    tagsIds.forEach(async (tagsId) => {
      await prisma.postsTags.create({
        data: {
          postId: parseInt(id),
          tagsId,
        },
      });
    });
  }

  res.status(200).json({ success: true, data: updatedPost });
})

exports.getAllPostsAuthor = asyncHandler(async (req,res,next) =>{
  const id = req.user.id;
  const {page, limit} = req.query;
  const posts = await prisma.posts.findMany({
    where: { authorId: id },
    skip: (parseInt(page) - 1) * limit,
    take: parseInt(limit),
  });
  res.status(200).json({ success: true, data: posts });
})

exports.getAllPostsAdmin = asyncHandler(async (req,res,next) =>{
  const {page, limit} = req.query;
  const posts = await prisma.posts.findMany({
    skip: (parseInt(page) - 1) * limit,
    take: parseInt(limit),
  });
  res.status(200).json({ success: true, data: posts });
})

exports.deletePostAdmin = asyncHandler(async (req,res,next) =>{
  const id = req.params.id;

  const post = await prisma.posts.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post) {
    return next(new errorResponse('Post not found', 404));
  }

  await prisma.posts.delete({
    where: { id: parseInt(id) },
  });

  await prisma.postsTags.deleteMany({
    where: { postId: parseInt(id) },
  });

  await deleteObject(post.key);

  res.status(200).json({ success: true, message: 'Post deleted successfully' });
})

exports.getAllPostsUser = asyncHandler(async (req,res,next) =>{
  const {page, limit} = req.query;
  const posts = await prisma.posts.findMany({
    skip: (parseInt(page) - 1) * limit,
    take: parseInt(limit),
  });
  res.status(200).json({ success: true, data: posts });
})

exports.getPostById = asyncHandler(async (req,res,next) =>{
  const id = req.params.id;
  const post = await prisma.posts.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post) {
    return next(new errorResponse('Post not found', 404));
  }

  const getComments = await axios.get(`http://localhost:3003/comments/post/${id}`);

  res.status(200).json({ success: true, data: post });
})

exports.getPostsByAuthor = asyncHandler(async (req,res,next) =>{
  const authorId = req.params.authorId;
  const {page, limit} = req.query;
  const posts = await prisma.posts.findMany({
    where: { authorId: parseInt(authorId) },
    skip: (parseInt(page) - 1) * limit,
    take: parseInt(limit),
  });

  res.status(200).json({ success: true, data: posts });
})

exports.searchPosts = asyncHandler(async (req,res,next) =>{
  const { query } = req.query;
  const {page, limit} = req.query;
  const posts = await prisma.posts.findMany({
    where: {
      OR: [
        { subject: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    },
    skip: (parseInt(page) - 1) * limit,
    take: parseInt(limit),
  });

  res.status(200).json({ success: true, data: posts });
})

exports.getPreSignedUrl = asyncHandler(async (req, res)=>{
    const { key } = req.body;
    
    const url = await getPresignedUrl(key);
    return res.status(200).json({ success: true, data: url });
})