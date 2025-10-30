const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const crypto = require('crypto');

// ==================== HELPER FUNCTIONS ====================

// Generate eSewa signature using HMAC SHA256
const generateEsewaSignature = (message, secretKey) => {
    try {
        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(message);
        return hmac.digest('base64');
    } catch (error) {
        console.error('Error generating eSewa signature:', error);
        throw new Error('Failed to generate payment signature');
    }
};

// Create signature message for eSewa
const createSignatureMessage = (totalAmount, transactionUuid, productCode) => {
    return `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
};

// Test function to verify signature generation (optional)
const testEsewaSignature = () => {
    const testData = {
        totalAmount: "100",
        transactionUuid: "123456789",
        productCode: "EPAYTEST"
    };
    
    const secretKey = "8gBm/:&EnhH.1/q";
    const signatureMessage = createSignatureMessage(
        testData.totalAmount,
        testData.transactionUuid,
        testData.productCode
    );
    
    const signature = generateEsewaSignature(signatureMessage, secretKey);
    
    console.log('🔐 eSewa Signature Test:');
    console.log('Message:', signatureMessage);
    console.log('Expected Signature:', 'i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=');
    console.log('Generated Signature:', signature);
    console.log('Match:', signature === 'i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=');
    
    return signature === 'i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=';
};

// ==================== CONTROLLER FUNCTIONS ====================

exports.initiateEsewaPayment = async (req, res) => {
    try {
        const { orderId, customerDetails } = req.body;
        console.log('🔄 eSewa payment initiation for order:', orderId);

        // Find the existing order
        const order = await Order.findById(orderId);
        if (!order) {
            console.log('❌ Order not found:', orderId);
            return res.status(404).json({ error: 'Order not found' });
        }

        const totalAmount = order.totals.grandTotal;
        console.log('💰 Order total amount:', totalAmount);
        
        // Calculate amounts as per eSewa requirements
        const amount = totalAmount;
        const taxAmount = 0;
        const productServiceCharge = 0;
        const productDeliveryCharge = 0;

        // Generate unique transaction UUID
        const transactionUuid = `ESEWA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.replace(/[^a-zA-Z0-9-]/g, '');
        
        // eSewa credentials
        const productCode = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
        const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";

        console.log('🔐 Generating signature with:', {
            totalAmount: totalAmount.toFixed(2),
            transactionUuid,
            productCode
        });

        // Create signature
        const signatureMessage = createSignatureMessage(
            totalAmount.toFixed(2),
            transactionUuid,
            productCode
        );
        const signature = generateEsewaSignature(signatureMessage, secretKey);

        // URLs for redirection
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const successUrl = `${baseUrl}/esewa/verify`;
        const failureUrl = `${baseUrl}/esewa/failure`;

        // Signed field names
        const signedFieldNames = "total_amount,transaction_uuid,product_code";

        console.log('📝 Prepared eSewa payment data:', {
            amount: amount.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            transactionUuid,
            productCode,
            signature: signature.substring(0, 20) + '...' // Log partial signature
        });

        // Create transaction record
        await Transaction.create({ 
            order: order._id, 
            user: order.user, 
            gateway: 'eSewa',
            amount: totalAmount, 
            status: 'Initiated',
            transactionId: transactionUuid
        });

        // Update order payment info
        await Order.findByIdAndUpdate(orderId, { 
            'payment.method': 'eSewa', 
            'payment.status': 'Initiated',
            'payment.pid': transactionUuid,
            'payment.signature': signature
        });

        // Return eSewa form data to frontend
        const responseData = {
            success: true,
            paymentData: {
                amount: amount.toFixed(2),
                tax_amount: taxAmount.toFixed(2),
                total_amount: totalAmount.toFixed(2),
                transaction_uuid: transactionUuid,
                product_code: productCode,
                product_service_charge: productServiceCharge.toFixed(2),
                product_delivery_charge: productDeliveryCharge.toFixed(2),
                success_url: successUrl,
                failure_url: failureUrl,
                signed_field_names: signedFieldNames,
                signature: signature
            },
            orderId: orderId
        };

        console.log('✅ Sending response to frontend');
        
        res.json(responseData);

    } catch (error) {
        console.error('❌ eSewa payment initiation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initiate eSewa payment: ' + error.message
        });
    }
};

exports.verifyEsewaPayment = async (req, res) => {
    try {
        const { 
            amount, 
            tax_amount, 
            total_amount, 
            transaction_uuid, 
            product_code, 
            signature
        } = req.query;

        console.log('🔍 eSewa Verification Callback:', req.query);

        // Find transaction by UUID
        const transaction = await Transaction.findOne({ 
            transactionId: transaction_uuid,
            gateway: 'eSewa'
        }).populate('order');

        if (!transaction) {
            console.error('Transaction not found:', transaction_uuid);
            return res.status(404).send('Transaction not found');
        }

        const order = transaction.order;

        // Verify signature
        const signatureMessage = createSignatureMessage(total_amount, transaction_uuid, product_code);
        const expectedSignature = generateEsewaSignature(signatureMessage, process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q");
        
        const signatureValid = signature === expectedSignature;
        const amountValid = Math.abs(parseFloat(total_amount) - order.totals.grandTotal) < 0.01;

        console.log('🔐 Signature Verification:', {
            signatureValid,
            amountValid,
            receivedSignature: signature,
            expectedSignature: expectedSignature
        });

        // Determine payment status
        let paymentStatus = 'Failed';
        let orderStatus = 'Created';
        let transactionStatus = 'Failed';

        if (signatureValid && amountValid) {
            paymentStatus = 'Paid';
            orderStatus = 'Confirmed';
            transactionStatus = 'Completed';
        }

        // Update order
        await Order.findOneAndUpdate({ orderId: transaction_uuid }, {
            'payment.status': paymentStatus,
            'payment.referenced': transaction_uuid,
            status: orderStatus
        });

        // Update transaction
        await Transaction.findByIdAndUpdate(transaction._id, {
            status: transactionStatus,
            raw: req.query,
            verifiedAt: new Date()
        });

        console.log(`✅ eSewa Payment ${paymentStatus}:`, order._id);

        // Redirect to frontend
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        if (paymentStatus === 'Paid') {
            return res.redirect(`${frontendUrl}/order-success/${order._id}?payment=success&method=eSewa`);
        } else {
            return res.redirect(`${frontendUrl}/payment/failed?reason=verification_failed&orderId=${order._id}`);
        }

    } catch (error) {
        console.error('❌ eSewa verification error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/payment/failed?reason=server_error`);
    }
};

exports.failEsewa = async (req, res) => {
    try {
        const { transaction_uuid, reason, message } = req.query;

        console.log('❌ eSewa Payment Failure:', req.query);

        if (transaction_uuid) {
            // Update transaction and order status
            await Transaction.findOneAndUpdate(
                { transactionId: transaction_uuid, gateway: 'eSewa' },
                { 
                    status: 'Failed',
                    raw: req.query,
                    failedAt: new Date()
                }
            );

            await Order.findOneAndUpdate(
                { 'payment.pid': transaction_uuid },
                {
                    'payment.status': 'Failed',
                    status: 'Created'
                }
            );
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/payment/failed?reason=user_cancelled`);

    } catch (error) {
        console.error('Error handling eSewa failure:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/payment/failed?reason=error`);
    }
};

exports.checkEsewaStatus = async (req, res) => {
    try {
        const { transaction_uuid, order_id } = req.query;

        console.log('🔍 eSewa Status Check Request:', { transaction_uuid, order_id });

        let transaction;
        let order;

        if (transaction_uuid) {
            transaction = await Transaction.findOne({ 
                transactionId: transaction_uuid,
                gateway: 'eSewa'
            });
            if (transaction) {
                order = await Order.findById(transaction.order);
            }
        } else if (order_id) {
            order = await Order.findById(order_id);
            if (order) {
                transaction = await Transaction.findOne({ 
                    order: order_id,
                    gateway: 'eSewa'
                });
            }
        }

        if (!transaction && !order) {
            return res.status(404).json({
                success: false,
                error: 'Transaction or order not found'
            });
        }

        const response = {
            success: true,
            transaction: null,
            order: null
        };

        if (transaction) {
            response.transaction = {
                transactionId: transaction.transactionId,
                status: transaction.status,
                amount: transaction.amount,
                gateway: transaction.gateway,
                createdAt: transaction.createdAt
            };
        }

        if (order) {
            response.order = {
                orderId: order._id,
                status: order.status,
                payment: {
                    method: order.payment.method,
                    status: order.payment.status,
                    pid: order.payment.pid
                },
                totals: order.totals
            };
        }

        console.log('✅ eSewa Status Check Response:', response);

        res.json(response);

    } catch (error) {
        console.error('❌ eSewa status check error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check eSewa payment status: ' + error.message
        });
    }
};

// Test the signature generation (run this once to verify)
testEsewaSignature();

module.exports = exports;