const { body, validationResult, param, query } = require('express-validator');
const mongoose = require('mongoose');

// Custom validation functions
const isObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid ID format');
  }
  return true;
};

const isPhoneNumber = (value) => {
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  if (!phoneRegex.test(value)) {
    throw new Error('Invalid phone number format');
  }
  return true;
};

const isCoordinate = (value) => {
  if (isNaN(parseFloat(value)) || Math.abs(parseFloat(value)) > 90) {
    throw new Error('Invalid coordinate value');
  }
  return true;
};

// Validation middleware for user registration
exports.validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .custom(isPhoneNumber)
    .withMessage('Please provide a valid phone number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['farmer', 'buyer', 'transporter', 'admin'])
    .withMessage('Invalid role specified'),
  
  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  
  body('city')
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('lat')
    .notEmpty()
    .withMessage('Latitude is required')
    .custom(isCoordinate)
    .withMessage('Invalid latitude value'),
  
  body('lng')
    .notEmpty()
    .withMessage('Longitude is required')
    .custom(isCoordinate)
    .withMessage('Invalid longitude value'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for user login
exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for product creation
exports.validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('unit')
    .isIn(['kg', 'g', 'piece', 'dozen', 'litre', 'pack'])
    .withMessage('Invalid unit specified'),
  
  body('category')
    .isIn(['vegetables', 'fruits', 'grains', 'spices', 'dairy', 'poultry', 'flowers', 'herbs', 'other'])
    .withMessage('Invalid category specified'),
  
  body('isOrganic')
    .optional()
    .isBoolean()
    .withMessage('isOrganic must be a boolean value'),
  
  body('harvestDate')
    .optional()
    .isISO8601()
    .withMessage('Harvest date must be a valid date'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for order creation
exports.validateOrder = [
  body('products')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one product'),
  
  body('products.*.product')
    .notEmpty()
    .withMessage('Product ID is required')
    .custom(isObjectId)
    .withMessage('Invalid product ID format'),
  
  body('products.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  
  body('shippingAddress.address')
    .notEmpty()
    .withMessage('Shipping address is required'),
  
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('Shipping city is required'),
  
  body('paymentMethod')
    .isIn(['esewa', 'khalti', 'cash_on_delivery'])
    .withMessage('Invalid payment method'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for payment initiation
exports.validatePayment = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .custom(isObjectId)
    .withMessage('Invalid order ID format'),
  
  body('paymentMethod')
    .isIn(['esewa', 'khalti', 'cash_on_delivery'])
    .withMessage('Invalid payment method'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for ID parameters
exports.validateIdParam = [
  param('id')
    .custom(isObjectId)
    .withMessage('Invalid ID format'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for query parameters
exports.validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for product filters
exports.validateProductFilters = [
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  
  query('category')
    .optional()
    .isIn(['vegetables', 'fruits', 'grains', 'spices', 'dairy', 'poultry', 'flowers', 'herbs', 'other'])
    .withMessage('Invalid category'),
  
  query('isOrganic')
    .optional()
    .isBoolean()
    .withMessage('isOrganic must be a boolean value'),
  
  query('lat')
    .optional()
    .custom(isCoordinate)
    .withMessage('Invalid latitude value'),
  
  query('lng')
    .optional()
    .custom(isCoordinate)
    .withMessage('Invalid longitude value'),
  
  query('distance')
    .optional()
    .isFloat({ min: 1, max: 1000 })
    .withMessage('Distance must be between 1 and 1000 km'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for user update
exports.validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .custom(isPhoneNumber)
    .withMessage('Please provide a valid phone number'),
  
  body('address')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  
  body('city')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('lat')
    .optional()
    .custom(isCoordinate)
    .withMessage('Invalid latitude value'),
  
  body('lng')
    .optional()
    .custom(isCoordinate)
    .withMessage('Invalid longitude value'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for password update
exports.validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for forgot password
exports.validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for reset password
exports.validateResetPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Sanitization middleware to prevent XSS attacks
exports.sanitizeInput = (req, res, next) => {
  // Sanitize string fields in body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
    });
  }
  
  // Sanitize string fields in query
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
    });
  }
  
  // Sanitize string fields in params
  if (req.params) {
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = req.params[key].replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
    });
  }
  
  next();

  // Validation middleware for refund
exports.validateRefund = [
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Refund amount must be a positive number'),
  
  body('reason')
    .notEmpty()
    .withMessage('Refund reason is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Refund reason must be between 5 and 200 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for refund
exports.validateRefund = [
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Refund amount must be a positive number'),
  
  body('reason')
    .notEmpty()
    .withMessage('Refund reason is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Refund reason must be between 5 and 200 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];
};