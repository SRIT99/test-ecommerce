const { baseUrl, esewa } = require('../config/env');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const esewaSvc = require('../services/esewaService');
const khaltiSvc = require('../services/khaltiService');
const { generateEsewaSignature, createSignatureMessage } = require('../utils/paymentUtils');
// exports.payEsewa = async (req, res) => {
//     try {
//         const { orderId } = req.body;
//         const order = await Order.findById(orderId);
        
//         if (!order || order.user.toString() !== req.user._id.toString()) {
//             return res.status(404).json({ error: 'Order not found' });
//         }

//         const pid = order._id.toString();
//         const amt = order.totals.grandTotal;
//         const params = new URLSearchParams({
//             amt, psc: 0, pdc: 0, txAmt: 0, tAmt: amt,
//             pid, scd: esewa.merchant,
//             su: `${baseUrl}/payments/esewa/verify`,
//             fu: `${baseUrl}/payments/esewa/failure`
//         });

//         await Transaction.create({ 
//             order: order._id, 
//             user: req.user._id, 
//             gateway: 'eSewa',
//             amount: amt, 
//             status: 'Initiated' 
//         });

//         await Order.findByIdAndUpdate(orderId, { 
//             'payment.method': 'eSewa', 
//             'payment.status': 'Initiated', 
//             'payment.pid': pid 
//         });

//         // ✅ RETURN JSON instead of redirect
//         const paymentUrl = `${esewaSvc.gatewayBase()}/epay/main?${params.toString()}`;
        
//         res.json({
//             success: true,
//             paymentUrl: paymentUrl,
//             orderId: orderId
//         });

//     } catch (error) {
//         console.error('eSewa payment error:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Failed to initiate eSewa payment'
//         });
//     }
// };
// eSewa Payment Failure Handler
exports.payEsewa = async (req, res) => {
    try {
        const { orderId } = req.body;
        console.log('🔄 eSewa payment initiation for order:', orderId);

        const order = await Order.findById(orderId);
        
        if (!order || order.user.toString() !== req.user._id.toString()) {
            console.log('❌ Order not found or user mismatch');
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
        const signatureMessage = `total_amount=${totalAmount.toFixed(2)},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        const signature = generateEsewaSignature(signatureMessage, secretKey);

        // URLs for redirection
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const successUrl = `${baseUrl}/payments/esewa/verify`;
        const failureUrl = `${baseUrl}/payments/esewa/failure`;

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
            user: req.user._id, 
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

        // ✅ Return eSewa form data to frontend
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

        console.log('✅ Sending response to frontend:', responseData);
        
        res.json(responseData);

    } catch (error) {
        console.error('❌ eSewa payment initiation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initiate eSewa payment: ' + error.message
        });
    }
};
exports.failEsewa = async (req, res) => {
    try {
        const { 
            transaction_uuid,
            reason,
            message 
        } = req.query;

        console.log('❌ eSewa Payment Failure Callback:', req.query);

        if (transaction_uuid) {
            // Find and update the transaction
            const transaction = await Transaction.findOne({ 
                transactionId: transaction_uuid,
                gateway: 'eSewa'
            });

            if (transaction) {
                // Update transaction status
                await Transaction.findByIdAndUpdate(transaction._id, {
                    status: 'Failed',
                    raw: req.query,
                    failedAt: new Date(),
                    failureReason: reason || message || 'Payment failed'
                });

                // Update order status
                await Order.findOneAndUpdate(
                    { 'payment.pid': transaction_uuid },
                    {
                        'payment.status': 'Failed',
                        'payment.failure_reason': reason || message,
                        status: 'Created'
                    }
                );

                console.log(`❌ eSewa payment failed for transaction: ${transaction_uuid}`, { reason, message });
            }
        }

        // Redirect to frontend failure page
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const redirectUrl = new URL(`${frontendUrl}/payment/failed`);
        
        // Add failure details to URL
        redirectUrl.searchParams.set('reason', 'payment_failed');
        if (transaction_uuid) redirectUrl.searchParams.set('transactionId', transaction_uuid);
        if (reason) redirectUrl.searchParams.set('detail', reason);
        if (message) redirectUrl.searchParams.set('message', message);

        return res.redirect(redirectUrl.toString());

    } catch (error) {
        console.error('Error handling eSewa failure:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/payment/failed?reason=server_error`);
    }
};

// eSewa Status Check API
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

        // Prepare response data
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
                createdAt: transaction.createdAt,
                failureReason: transaction.failureReason
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

// Generic Payment Status Check (for any gateway)
exports.checkPaymentStatus = async (req, res) => {
    try {
        const { order_id, transaction_id, gateway } = req.query;

        console.log('🔍 Payment Status Check:', { order_id, transaction_id, gateway });

        let transaction;
        let order;

        if (transaction_id) {
            transaction = await Transaction.findOne({ 
                transactionId: transaction_id 
            });
            if (transaction) {
                order = await Order.findById(transaction.order);
            }
        } else if (order_id) {
            order = await Order.findById(order_id);
            if (order) {
                transaction = await Transaction.findOne({ 
                    order: order_id,
                    ...(gateway && { gateway: gateway })
                });
            }
        }

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        const response = {
            success: true,
            order: {
                _id: order._id,
                status: order.status,
                payment: order.payment
            },
            transaction: transaction ? {
                _id: transaction._id,
                status: transaction.status,
                gateway: transaction.gateway,
                amount: transaction.amount,
                transactionId: transaction.transactionId,
                createdAt: transaction.createdAt
            } : null
        };

        console.log('✅ Payment Status Response:', response);

        res.json(response);

    } catch (error) {
        console.error('Payment status check error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check payment status'
        });
    }
};
exports.verifyEsewa = async (req, res) => {
  const { amt, pid, rid } = req.query;
  const ok = await esewaSvc.verify({ amt, pid, rid });
  const orderId = pid;

  await Order.findByIdAndUpdate(orderId, {
    'payment.status': ok ? 'Paid' : 'Failed',
    'payment.referenceId': rid
  });

  await Transaction.findOneAndUpdate(
    { order: orderId, gateway: 'eSewa' },
    { status: ok ? 'Completed' : 'Failed', raw: { amt, pid, rid } }
  );

  res.send(ok ? 'eSewa payment successful' : 'eSewa payment failed');
};

exports.payKhalti = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order || order.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const amountPaisa = Math.round(order.totals.grandTotal * 100);
        const url = await khaltiSvc.initiate({
            amountPaisa,
            orderId: order._id.toString(), // Fixed: was order_id
            orderName: `Order ${order._id}`
        });

        await Transaction.create({ 
            order: order._id, // Fixed: was order_id
            user: req.user._id, // Fixed: was req.user_id
            gateway: 'Khalti',
            amount: order.totals.grandTotal, 
            status: 'Initiated' 
        });

        await Order.findByIdAndUpdate(orderId, { 
            'payment.method': 'Khalti', 
            'payment.status': 'Initiated' 
        });

        // ✅ RETURN JSON instead of redirect
        res.json({
            success: true,
            paymentUrl: url,
            orderId: orderId
        });

    } catch (error) {
        console.error('Khalti payment error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initiate Khalti payment'
        });
    }
};

exports.verifyKhalti = async (req, res) => {
  const { pidx } = req.query;
  const result = await khaltiSvc.lookup(pidx);
  const orderId = result?.purchase_order_id;
  const success = result?.status === 'Completed';

  await Order.findByIdAndUpdate(orderId, { 'payment.status': success ? 'Paid' : 'Failed', 'payment.pidx': pidx });
  await Transaction.findOneAndUpdate({ order: orderId, gateway: 'Khalti' }, { status: success ? 'Completed' : 'Failed', raw: result });

  res.send(success ? 'Khalti payment successful' : 'Khalti payment not completed');
};


// ✅ CORRECTED - Return JSON for frontend




exports.codPlace = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order || order.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await Order.findByIdAndUpdate(orderId, { 
            'payment.method': 'COD', 
            'payment.status': 'Pending' 
        });

        await Transaction.create({ 
            order: order._id, // Fixed: was order_id
            user: req.user._id, // Fixed: was req.user_id
            gateway: 'COD',
            amount: order.totals.grandTotal, 
            status: 'Initiated' 
        });

        res.json({ 
            success: true,
            message: 'COD placed, pay on delivery' 
        });

    } catch (error) {
        console.error('COD placement error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to place COD order'
        });
    }
};