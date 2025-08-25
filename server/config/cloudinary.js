const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary utility functions
const cloudinaryUtils = {
  // Upload image to Cloudinary
  uploadImage: async (filePath, folder = 'doko-marketplace') => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        quality: 'auto',
        fetch_format: 'auto',
      });
      return result;
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  },

  // Upload image from buffer (for multer memory storage)
  uploadImageFromBuffer: async (buffer, folder = 'doko-marketplace') => {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            quality: 'auto',
            fetch_format: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        uploadStream.end(buffer);
      });
    } catch (error) {
      throw new Error(`Cloudinary upload from buffer failed: ${error.message}`);
    }
  },

  // Delete image from Cloudinary
  deleteImage: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  },

  // Delete multiple images
  deleteMultipleImages: async (publicIds) => {
    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      return result;
    } catch (error) {
      throw new Error(`Cloudinary multiple delete failed: ${error.message}`);
    }
  },

  // Generate image URL with transformations
  generateImageUrl: (publicId, options = {}) => {
    const defaultOptions = {
      width: 800,
      height: 600,
      crop: 'limit',
      quality: 'auto',
      fetch_format: 'auto'
    };

    const transformationOptions = { ...defaultOptions, ...options };
    return cloudinary.url(publicId, transformationOptions);
  },

  // Generate responsive image URLs for different screen sizes
  generateResponsiveUrls: (publicId, sizes = [400, 800, 1200]) => {
    return sizes.map(size => ({
      width: size,
      url: cloudinary.url(publicId, {
        width: size,
        crop: 'limit',
        quality: 'auto',
        fetch_format: 'auto'
      })
    }));
  },

  // Get image information
  getImageInfo: async (publicId) => {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      throw new Error(`Cloudinary get info failed: ${error.message}`);
    }
  },

  // Create image transformation for specific use cases
  createTransformation: (options = {}) => {
    const defaultTransformation = {
      quality: 'auto',
      fetch_format: 'auto'
    };

    return { ...defaultTransformation, ...options };
  }
};

// Cloudinary storage configuration for multer
const createCloudinaryStorage = (folder = 'doko-marketplace') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ],
      // Optional: Add timestamp to filename to avoid conflicts
      public_id: (req, file) => {
        const timestamp = Date.now();
        const originalName = file.originalname.split('.')[0];
        return `${originalName}_${timestamp}`;
      }
    },
  });
};

// Specific storage configurations for different use cases
const storageConfigs = {
  // For product images
  productImages: createCloudinaryStorage('doko-marketplace/products'),
  
  // For user avatars
  userAvatars: createCloudinaryStorage('doko-marketplace/avatars'),
  
  // For general uploads
  general: createCloudinaryStorage('doko-marketplace/general')
};

// Multer upload instances for different use cases
const uploaders = {
  productImages: multer({ 
    storage: storageConfigs.productImages,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 5 // Maximum 5 files
    }
  }),
  
  userAvatar: multer({ 
    storage: storageConfigs.userAvatars,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB limit
      files: 1 // Only 1 file
    }
  }),
  
  general: multer({ 
    storage: storageConfigs.general,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    }
  })
};

// Middleware for different upload types
const uploadMiddleware = {
  // For product images (multiple files)
  productImages: (req, res, next) => {
    const upload = uploaders.productImages.array('images', 5);
    upload(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB.'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files. Maximum is 5 images.'
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  },

  // For user avatar (single file)
  userAvatar: (req, res, next) => {
    const upload = uploaders.userAvatar.single('avatar');
    upload(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 2MB.'
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  },

  // For general uploads
  general: (fieldName, maxCount = 1) => {
    return (req, res, next) => {
      const upload = uploaders.general.array(fieldName, maxCount);
      upload(req, res, (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'File too large. Maximum size is 10MB.'
            });
          }
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }
        next();
      });
    };
  }
};

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Apply file filter to all uploaders
Object.values(uploaders).forEach(uploader => {
  uploader.fileFilter = fileFilter;
});

// Export everything
module.exports = {
  cloudinary,
  cloudinaryUtils,
  storageConfigs,
  uploaders,
  uploadMiddleware,
  fileFilter
};