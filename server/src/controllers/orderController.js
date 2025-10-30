const Order = require('../models/Order');
const Product = require('../models/Product');

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