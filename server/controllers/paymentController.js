const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const User = require('../models/User');
const axios = require('axios');

// @desc    Initiate payment
// @route   POST /api/v1/payments/initiate
// @access  Private
exports.initiatePayment = async (req, res, next) => {
  try {
    const { orderId, paymentMethod } = req.body;
    
    // Validate order
    const order = await Order.findById(orderId)
      .populate('buyer', 'name email phone')
      .populate('farmer', 'name');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to user
    if (order.buyer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order'
      });
    }
    
    // Check if order is already paid
    if (order.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }
    
    // Create transaction record
    const transaction = await Transaction.create({
      order: orderId,
      user: req.user.id,
      amount: order.totalAmount + order.deliveryFee,
      paymentMethod,
      description: `Payment for order ${order.orderId}`,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        deviceType: req.device.type || 'unknown'
      }
    });
    
    // Generate payment data based on method
    let paymentData = {};
    
    switch (paymentMethod) {
      case 'esewa':
        paymentData = await generateEsewaPayload(transaction, order);
        break;
      case 'khalti':
        paymentData = await generateKhaltiPayload(transaction, order);
        break;
      case 'cash_on_delivery':
        // For COD, mark as pending and update order
        transaction.status = 'pending';
        await transaction.save();
        
        order.paymentStatus = 'pending';
        await order.save();
        
        return res.status(200).json({
          success: true,
          message: 'Cash on delivery selected. Payment will be collected upon delivery.',
          data: { transaction }
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid payment method'
        });
    }
    
    await transaction.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        transaction,
        paymentData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify payment
// @route   POST /api/v1/payments/verify
// @access  Public (called by payment gateway)
exports.verifyPayment = async (req, res, next) => {
  try {
    const { transactionId, gateway, data } = req.body;
    
    const transaction = await Transaction.findOne({
      transactionId,
      'paymentGateway.name': gateway
    }).populate('order');
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    let verificationResult;
    
    switch (gateway) {
      case 'esewa':
        verificationResult = await verifyEsewaPayment(data, transaction);
        break;
      case 'khalti':
        verificationResult = await verifyKhaltiPayment(data, transaction);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid payment gateway'
        });
    }
    
    if (verificationResult.success) {
      // Update transaction status
      transaction.status = 'completed';
      transaction.paymentGateway = {
        ...transaction.paymentGateway,
        statusCode: verificationResult.statusCode,
        statusMessage: verificationResult.message,
        rawResponse: verificationResult.rawData
      };
      
      // Update order payment status
      const order = await Order.findById(transaction.order);
      order.paymentStatus = 'completed';
      await order.save();
      
      await transaction.save();
      
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      // Payment failed
      transaction.status = 'failed';
      transaction.failureReason = {
        code: verificationResult.errorCode,
        message: verificationResult.errorMessage,
        details: verificationResult.rawData
      };
      
      await transaction.save();
      
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get transaction history
// @route   GET /api/v1/payments/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { user: req.user.id };
    if (status) query.status = status;
    
    const transactions = await Transaction.find(query)
      .populate('order', 'orderId totalAmount')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Transaction.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/v1/payments/transactions/:id
// @access  Private
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('order').populate('user', 'name email');
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Process refund
// @route   POST /api/v1/payments/transactions/:id/refund
// @access  Private (Admin only)
exports.refundPayment = async (req, res, next) => {
  try {
    const { amount, reason } = req.body;
    
    const transaction = await Transaction.findById(req.params.id)
      .populate('order');
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    // Check if transaction can be refunded
    if (!transaction.canRefund()) {
      return res.status(400).json({
        success: false,
        message: 'Transaction cannot be refunded'
      });
    }
    
    // Process refund
    await transaction.processRefund(amount, reason, req.user.id);
    
    // Update order status if full refund
    if (transaction.status === 'refunded') {
      const order = await Order.findById(transaction.order);
      order.paymentStatus = 'refunded';
      order.orderStatus = 'cancelled';
      await order.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper functions for payment gateways
const generateEsewaPayload = async (transaction, order) => {
  const payload = {
    amount: transaction.amount,
    tax_amount: 0,
    total_amount: transaction.amount,
    transaction_uuid: transaction.transactionId,
    product_code: 'EPAY_DOKO',
    product_service_charge: 0,
    product_delivery_charge: order.deliveryFee,
    success_url: `${process.env.CLIENT_URL}/payment/success?gateway=esewa`,
    failure_url: `${process.env.CLIENT_URL}/payment/failure`,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature: '' // This would be generated with your secret key
  };
  
  return payload;
};

const generateKhaltiPayload = async (transaction, order) => {
  const payload = {
    amount: transaction.amount * 100, // Khalti expects amount in paisa
    purchase_order_id: transaction.transactionId,
    purchase_order_name: `Order ${order.orderId}`,
    customer_info: {
      name: order.buyer.name,
      email: order.buyer.email,
      phone: order.buyer.phone
    },
    return_url: `${process.env.CLIENT_URL}/payment/verify?gateway=khalti`
  };
  
  return payload;
};

const verifyEsewaPayment = async (data, transaction) => {
  try {
    // Implement eSewa verification logic
    // This would make an API call to eSewa's verification endpoint
    const verificationUrl = process.env.ESEWA_VERIFICATION_URL;
    
    const response = await axios.post(verificationUrl, {
      transaction_id: data.transaction_id,
      total_amount: transaction.amount
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.ESEWA_SECRET_KEY}`
      }
    });
    
    return {
      success: response.data.status === 'COMPLETE',
      statusCode: response.data.status,
      message: response.data.message,
      rawData: response.data
    };
  } catch (error) {
    return {
      success: false,
      errorCode: 'VERIFICATION_FAILED',
      errorMessage: error.message,
      rawData: error.response?.data
    };
  }
};

const verifyKhaltiPayment = async (data, transaction) => {
  try {
    // Implement Khalti verification logic
    const verificationUrl = `${process.env.KHALTI_BASE_URL}/epayment/lookup/`;
    
    const response = await axios.post(verificationUrl, {
      pidx: data.pidx
    }, {
      headers: {
        'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`
      }
    });
    
    return {
      success: response.data.status === 'Completed',
      statusCode: response.data.status,
      message: response.data.message,
      rawData: response.data
    };
  } catch (error) {
    return {
      success: false,
      errorCode: 'VERIFICATION_FAILED',
      errorMessage: error.message,
      rawData: error.response?.data
    };
  }
};