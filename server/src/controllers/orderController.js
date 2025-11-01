const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        console.log('Received order data:', { items, shippingAddress, paymentMethod });

        // Validate input
        if (!items?.length) return res.status(400).json({ error: 'No items in cart' });
        if (!['eSewa', 'Khalti', 'COD'].includes(paymentMethod)) {
            return res.status(400).json({ error: 'Invalid payment method' });
        }
        if (!shippingAddress?.name || !shippingAddress?.phone || !shippingAddress?.address) {
            return res.status(400).json({ error: 'Missing shipping address details' });
        }

        // Extract product IDs and validate they exist
        const productIds = items.map(i => i.productId).filter(id => id);
        if (productIds.length !== items.length) {
            return res.status(400).json({ error: 'Invalid product IDs in cart' });
        }

        console.log('Looking for products with IDs:', productIds);

        // Find products with proper error handling
        const dbProducts = await Product.find({
            _id: { $in: productIds },
            isActive: true
        });

        console.log('Found products:', dbProducts.length);

        if (dbProducts.length !== productIds.length) {
            const missingProducts = productIds.filter(id =>
                !dbProducts.find(p => p._id.toString() === id)
            );
            return res.status(400).json({
                error: 'Some products are unavailable or not found',
                missingProducts
            });
        }
         const ownProducts = dbProducts.filter(product => 
            product.sellerId && product.sellerId._id.toString() === req.user._id.toString()
        );

        if (ownProducts.length > 0) {
            const productNames = ownProducts.map(p => p.name).join(', ');
            return res.status(400).json({
                error: `You cannot purchase your own products: ${productNames}`
            });
        }
        // Create line items with proper price handling
        const lineItems = items.map(item => {
            const product = dbProducts.find(p => p._id.toString() === item.productId);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            // Use price field (not basePrice) and ensure it's a number
            const unitPrice = Number(product.price) || 0;
            const quantity = Number(item.quantity) || 1;

            console.log(`Product: ${product.name}, Price: ${unitPrice}, Quantity: ${quantity}`);

            return {
                product: product._id,
                name: product.name,
                unitPrice: unitPrice,
                quantity: quantity,
                sellerId: product.sellerId
            };
        });

        // Calculate totals with proper number conversion
        const subTotal = lineItems.reduce((total, item) => {
            return total + (Number(item.unitPrice) * Number(item.quantity));
        }, 0);

        const shipping = 0;
        const grandTotal = subTotal + shipping;

        console.log('Calculated totals:', { subTotal, shipping, grandTotal });

        // Validate totals
        if (isNaN(subTotal) || subTotal <= 0) {
            return res.status(400).json({ error: 'Invalid total amount calculated' });
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items: lineItems,
            totals: {
                subTotal: Number(subTotal.toFixed(2)),
                shipping: Number(shipping.toFixed(2)),
                grandTotal: Number(grandTotal.toFixed(2))
            },
            payment: {
                method: paymentMethod,
                status: paymentMethod === 'COD' ? 'Pending' : 'Initiated'
            },
            shippingAddress,
            status: 'Created'
        });

        console.log('Order created successfully:', order._id);

        res.status(201).json({
            success: true,
            order: {
                _id: order._id,
                items: order.items,
                totals: order.totals,
                payment: order.payment,
                status: order.status,
                shippingAddress: order.shippingAddress,
                createdAt: order.createdAt
            }
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create order: ' + error.message
        });
    }
};

// Get current user's orders
exports.myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name imageUrl price')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error('Get my orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders'
        });
    }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await Order.findById(id)
            .populate('user', 'name email')
            .populate('items.product', 'name imageUrl price');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Check if user has permission to view this order
        if (order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to view this order'
            });
        }

        res.json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error('Get order by ID error:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid order ID'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to fetch order details'
        });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['Created', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const order = await Order.findById(id);
        
        // Check if order exists and user has permission
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // For regular users, they can only cancel their own orders
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this order'
            });
        }

        // Update order status
        order.status = status;
        await order.save();

        res.json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update order status'
        });
    }
};

// ==================== FARMER/SELLER ORDER FUNCTIONS ====================

// Get orders for farmer/seller (their products' orders)
exports.getFarmerOrders = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        
        // Build query for farmer's orders
        let query = {
            'items.sellerId': req.user._id // Orders containing products sold by this farmer
        };

        // Add status filter if provided
        if (status && status !== 'all') {
            query.status = status;
        }

        // Add search filter if provided
        if (search) {
            query.$or = [
                { _id: { $regex: search, $options: 'i' } },
                { 'user.name': { $regex: search, $options: 'i' } }
            ];
        }

        const orders = await Order.find(query)
            .populate('user', 'name email phone')
            .populate('items.product', 'name price images')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            orders,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });

    } catch (error) {
        console.error('Get farmer orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching farmer orders'
        });
    }
};

// Get farmer analytics
exports.getFarmerAnalytics = async (req, res) => {
    try {
        const farmerId = req.user._id;

        // Get total orders count
        const totalOrders = await Order.countDocuments({
            'items.sellerId': farmerId
        });

        // Get orders by status
        const ordersByStatus = await Order.aggregate([
            { $match: { 'items.sellerId': farmerId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Get total revenue from delivered orders
        const revenueData = await Order.aggregate([
            { 
                $match: { 
                    'items.sellerId': farmerId,
                    status: 'Delivered',
                    'payment.status': 'Completed'
                } 
            },
            { 
                $unwind: '$items' 
            },
            {
                $match: {
                    'items.sellerId': farmerId
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { 
                        $sum: { 
                            $multiply: ['$items.unitPrice', '$items.quantity'] 
                        } 
                    }
                }
            }
        ]);

        // Get recent orders for timeline
        const recentOrders = await Order.find({
            'items.sellerId': farmerId
        })
        .populate('user', 'name')
        .populate('items.product', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

        const totalRevenue = revenueData[0]?.totalRevenue || 0;

        res.json({
            success: true,
            analytics: {
                totalOrders,
                ordersByStatus: ordersByStatus.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                totalRevenue,
                recentOrders
            }
        });

    } catch (error) {
        console.error('Get farmer analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching farmer analytics'
        });
    }
};

// ==================== ADMIN ORDER FUNCTIONS ====================

// Get all orders (Admin only - sees ALL orders in the system)
exports.getAllOrders = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        
        console.log('🔄 Fetching all orders with filters:', { status, search, page, limit });
        
        // Build query - admin can see ALL orders
        let query = {};

        // Add status filter if provided
        if (status && status !== 'all') {
            query.status = status;
        }

        // Add search filter if provided
        if (search) {
            query.$or = [
                { _id: { $regex: search, $options: 'i' } },
                { 'items.name': { $regex: search, $options: 'i' } }
            ];
        }

        console.log('🔍 MongoDB query:', JSON.stringify(query, null, 2));

        // First, let's check if there are any orders at all
        const totalOrders = await Order.countDocuments();
        console.log(`📊 Total orders in database: ${totalOrders}`);

        const orders = await Order.find(query)
            .populate('user', 'name email phone')
            .populate('items.product', 'name price images category')
            .populate('items.sellerId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        console.log(`✅ Found ${orders.length} orders matching query`);

        // If no orders found, return empty array instead of error
        res.json({
            success: true,
            orders: orders || [],
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: parseInt(page),
            total: totalOrders
        });

    } catch (error) {
        console.error('❌ Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching all orders: ' + error.message
        });
    }
};

// Get admin analytics
exports.getAdminAnalytics = async (req, res) => {
    try {
        // Total orders count
        const totalOrders = await Order.countDocuments();

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Total revenue (only from delivered and paid orders)
        const revenueData = await Order.aggregate([
            { 
                $match: { 
                    status: 'Delivered',
                    'payment.status': 'Completed'
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    totalRevenue: { $sum: '$totals.grandTotal' },
                    averageOrderValue: { $avg: '$totals.grandTotal' }
                } 
            }
        ]);

        // Orders over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const ordersOverTime = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totals.grandTotal' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top sellers
        const topSellers = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.sellerId',
                    totalSales: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.unitPrice', '$items.quantity'] } }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'sellerInfo'
                }
            },
            {
                $project: {
                    sellerName: { $arrayElemAt: ['$sellerInfo.name', 0] },
                    sellerEmail: { $arrayElemAt: ['$sellerInfo.email', 0] },
                    totalSales: 1,
                    totalRevenue: 1
                }
            }
        ]);

        // Recent activity
        const recentOrders = await Order.find()
            .populate('user', 'name')
            .populate('items.product', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        const totalRevenue = revenueData[0]?.totalRevenue || 0;
        const averageOrderValue = revenueData[0]?.averageOrderValue || 0;

        res.json({
            success: true,
            analytics: {
                totalOrders,
                ordersByStatus: ordersByStatus.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                totalRevenue,
                averageOrderValue,
                ordersOverTime,
                topSellers,
                recentOrders
            }
        });

    } catch (error) {
        console.error('Get admin analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admin analytics'
        });
    }
};

// Update order status (Admin version - can update any order)
exports.updateOrderStatusAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['Created', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
        .populate('user', 'name email')
        .populate('items.product', 'name');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order
        });

    } catch (error) {
        console.error('Admin update order status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update order status'
        });
    }
};

// Get order details for admin (can view any order)
exports.getOrderDetailsAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await Order.findById(id)
            .populate('user', 'name email phone')
            .populate('items.product', 'name imageUrl price category')
            .populate('items.sellerId', 'name email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            order
        });

    } catch (error) {
        console.error('Get order details admin error:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid order ID'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to fetch order details'
        });
    }
};