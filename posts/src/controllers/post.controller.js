const prisma = require('../config/prismaClient');
const asyncHandler = require('../utils/asyncHandler.utils');
const errorResponse = require('../utils/errorApi.utils');
const {addMessageToQueue} = require('../queues/producer.queues');

exports.createPost = asyncHandler(async (req, res, next) => {
  const { title, content, tagsIds } = req.body;
  const image = req.file ;
  const userId = req.user.id;

  if (!title || !content) {
    return next(new errorResponse('Title and content are required', 400));
  }

  const key = `${Date.now()}-${image.originalname}`;
  const location = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  image.key = key;
  image.location = location;

  const post = await prisma.post.create({
    data: {
      subject: title,
      content,
      authorId: userId,
      location: image.location,
      key: image.key,
    },
  });

  tagsIds.forEach(async (tagId) => {  
    await prisma.postTag.create({
      data: {
        postId: post.id,
        tagId,
      },
    });
  }); 

  if (image) {
    const mediaData = {
      image: image,
    };
    addMessageToQueue('post.create', mediaData);
  }

  res.status(201).json({ success: true, data: post });
});

exports.deletePost = asyncHandler(async (req,res,next) =>{
  const id = req.params.id;
  const userId = req.user.id;

  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post) {
    return next(new errorResponse('Post not found', 404));
  }

  if (post.authorId !== userId) {
    return next(new errorResponse('Unauthorized', 401));
  }

  await prisma.post.delete({
    where: { id: parseInt(id) },
  });

  await prisma.postTag.deleteMany({
    where: { postId: parseInt(id) },
  });

  addToQueue('post.delete', { key: post.key });  

  res.status(200).json({ success: true, message: 'Post deleted successfully' });  
  
})

exports.updatePost = asyncHandler(async (req,res,next) =>{    
  const id = req.params.id;
  const userId = req.user.id;

  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  });   

  if (!post) {
    return next(new errorResponse('Post not found', 404));  
  }

  if (post.authorId !== userId) {
    return next(new errorResponse('Unauthorized', 401));
  }   
  const { title, content, tagsIds } = req.body; 
  const image = req.file;
  image.key = post.key;

  const updatedPost = await prisma.post.update({
    where: { id: parseInt(id) },
    data: {
      subject: title || post.subject,
      content: content || post.content,
      key : post.key,
      location: post.location,
    },
  });

  if (tagsIds) {
    await prisma.postTag.deleteMany({
      where: { postId: parseInt(id) },
    });

    tagsIds.forEach(async (tagId) => {
      await prisma.postTag.create({
        data: {
          postId: parseInt(id),
          tagId,
        },
      });
    });
  }

  if (image) {
    const mediaData = {
      image: image,
    };
    addMessageToQueue('post.update', mediaData);
  }

  res.status(200).json({ success: true, data: updatedPost });
})

exports.getAllPostsAuthor = asyncHandler(async (req,res,next) =>{
  const id = req.user.id;
  const {page, limit} = req.query;
  const posts = await prisma.post.findMany({
    where: { authorId: id },
    skip: (parseInt(page) - 1) * limit,
    take: parseInt(limit),
  });
  res.status(200).json({ success: true, data: posts });
})

exports.getAllPostsAdmin = asyncHandler(async (req,res,next) =>{
  const {page, limit} = req.query;
  const posts = await prisma.post.findMany({
    skip: (parseInt(page) - 1) * limit,
    take: parseInt(limit),
  });
  res.status(200).json({ success: true, data: posts });
})

exports.deletePostAdmin = asyncHandler(async (req,res,next) =>{
  const id = req.params.id;

  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post) {
    return next(new errorResponse('Post not found', 404));
  }

  await prisma.post.delete({
    where: { id: parseInt(id) },
  });

  await prisma.postTag.deleteMany({
    where: { postId: parseInt(id) },
  });

  addToQueue('post.delete', { key: post.key });

  res.status(200).json({ success: true, message: 'Post deleted successfully' });
})

exports.getAllPostsUser = asyncHandler(async (req,res,next) =>{
  const {page, limit} = req.query;
  const posts = await prisma.post.findMany({
    skip: (parseInt(page) - 1) * limit,
    take: parseInt(limit),
  });
  res.status(200).json({ success: true, data: posts });
})

exports.getPostById = asyncHandler(async (req,res,next) =>{
  const id = req.params.id;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post) {
    return next(new errorResponse('Post not found', 404));
  }

  res.status(200).json({ success: true, data: post });
})

exports.getPostsByAuthor = asyncHandler(async (req,res,next) =>{
  const authorId = req.params.authorId;
  const {page, limit} = req.query;
  const posts = await prisma.post.findMany({
    where: { authorId: parseInt(authorId) },
    skip: (parseInt(page) - 1) * limit,
    take: parseInt(limit),
  });

  res.status(200).json({ success: true, data: posts });
})

exports.searchPosts = asyncHandler(async (req,res,next) =>{
  const { query } = req.query;
  const {page, limit} = req.query;
  const posts = await prisma.post.findMany({
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