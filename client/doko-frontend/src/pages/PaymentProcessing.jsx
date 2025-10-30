// src/pages/PaymentProcessing.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentProcessing = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const paymentMethod = searchParams.get('gateway'); // esewa or khalti
                const verificationData = Object.fromEntries(searchParams.entries());

                // Call verification API
                const result = await orderService.verifyPayment(paymentMethod, verificationData);

                if (result.success) {
                    setStatus('success');
                    // Redirect to success page after delay
                    setTimeout(() => {
                        navigate('/order-success', {
                            state: {
                                orderId: result.orderId,
                                paymentMethod: paymentMethod
                            }
                        });
                    }, 2000);
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setStatus('failed');
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                {status === 'processing' && (
                    <>
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-800">Processing Payment...</h2>
                        <p className="text-gray-600 mt-2">Please wait while we verify your payment</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">✓</span>
                        </div>
                        <h2 className="text-xl font-semibold text-green-600">Payment Successful!</h2>
                        <p className="text-gray-600 mt-2">Redirecting to order confirmation...</p>
                    </>
                )}
                {status === 'failed' && (
                    <>
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">✗</span>
                        </div>
                        <h2 className="text-xl font-semibold text-red-600">Payment Failed</h2>
                        <p className="text-gray-600 mt-2">Please try again or use a different payment method</p>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                            Back to Checkout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentProcessing;