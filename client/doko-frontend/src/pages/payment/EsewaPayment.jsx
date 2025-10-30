import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EsewaPaymentForm from '../../components/payment/esewa';

const EsewaPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { paymentData, orderId } = location.state || {};

    if (!paymentData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">Payment Error</h2>
                    <p className="text-gray-600 mb-6">No payment data found. Please try again.</p>
                    <button 
                        onClick={() => navigate('/checkout')}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Back to Checkout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <EsewaPaymentForm 
            paymentData={paymentData}
            orderId={orderId}
        />
    );
};

export default EsewaPayment;