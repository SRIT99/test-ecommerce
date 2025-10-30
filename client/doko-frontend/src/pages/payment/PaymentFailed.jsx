import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft, Home } from 'lucide-react';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const reason = searchParams.get('reason') || 'payment_failed';

    const getErrorMessage = () => {
        switch (reason) {
            case 'user_cancelled':
                return 'You cancelled the payment';
            case 'verification_failed':
                return 'Payment verification failed';
            case 'server_error':
                return 'Server error occurred';
            default:
                return 'Payment failed. Please try again.';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                <p className="text-gray-600 mb-6">{getErrorMessage()}</p>
                
                <div className="space-y-3">
                    <Link
                        to="/checkout"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center justify-center w-full"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Checkout
                    </Link>
                    <Link
                        to="/products"
                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center w-full"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;