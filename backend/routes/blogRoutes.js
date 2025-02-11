const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const BlogPost = require('../models/BlogPost');
const auth = require('../middleware/auth');
const logger = require('../config/logger');

// Validation middleware
const validateBlogPost = (req, res, next) => {
  const { title, excerpt, content } = req.body;
  const errors = [];

  if (!title || title.trim().length < 5) {
    errors.push('Title must be at least 5 characters long');
  }
  if (title && title.trim().length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  if (!excerpt || excerpt.trim().length < 10) {
    errors.push('Excerpt must be at least 10 characters long');
  }
  if (excerpt && excerpt.trim().length > 200) {
    errors.push('Excerpt must be less than 200 characters');
  }

  if (!content || content.trim().length < 50) {
    errors.push('Content must be at least 50 characters long');
  }

  if (!req.file) {
    errors.push('Image is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  next();
};

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'));
  }
}).single('image');

// Handle multer errors
const handleUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large. Max size is 5MB' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// Get all blog posts with pagination
router.get('/', async (req, res) => {
  try {
    logger.info('Fetching blog posts');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const totalPosts = await BlogPost.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await BlogPost.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email');

    logger.debug('Blog posts fetched successfully', { 
      count: posts.length,
      page,
      totalPages 
    });

    res.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      hasMore: page < totalPages
    });
  } catch (err) {
    logger.error('Error fetching blog posts', { 
      error: err.message,
      stack: err.stack 
    });
    res.status(500).json({ message: err.message });
  }
});

// Create new blog post
router.post('/', auth, handleUpload, validateBlogPost, async (req, res) => {
  try {
    logger.info('Creating new blog post', { userId: req.user.id });
    
    const { title, excerpt, content } = req.body;
    
    if (!req.file) {
      logger.warn('Blog post creation failed: No image provided', { userId: req.user.id });
      return res.status(400).json({ message: 'Image file is required' });
    }

    const post = new BlogPost({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      image: `/uploads/${req.file.filename}`,
      author: req.user.id
    });

    logger.debug('Attempting to save blog post', { 
      postId: post._id,
      userId: req.user.id 
    });

    const savedPost = await post.save();
    
    logger.info('Blog post created successfully', { 
      postId: savedPost._id,
      userId: req.user.id 
    });

    res.status(201).json(savedPost);
  } catch (err) {
    logger.error('Error creating blog post', { 
      error: err.message,
      stack: err.stack,
      userId: req.user?.id 
    });

    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(500).json({ 
      message: 'Error creating post. Please try again.',
      error: err.message 
    });
  }
});

// Update blog post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete blog post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.remove();
    res.json({ message: 'Post removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 