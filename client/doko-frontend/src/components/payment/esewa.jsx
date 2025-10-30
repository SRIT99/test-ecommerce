import React, { useEffect, useState } from 'react';

const EsewaPaymentForm = ({ paymentData, orderId }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    useEffect(() => {
        // Auto-submit form after a brief delay
        const timer = setTimeout(() => {
            const form = document.getElementById('esewaPaymentForm');
            if (form) {
                console.log('🔄 Auto-submitting eSewa form...');
                setIsSubmitting(true);
                form.submit();
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (!paymentData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Payment Error</h2>
                    <p className="text-gray-600">No payment data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                {isSubmitting ? (
                    <>
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Redirecting to eSewa...</h2>
                        <p className="text-gray-600">Please wait while we redirect you to eSewa</p>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">₹</span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Ready to Pay with eSewa</h2>
                        <p className="text-gray-600 mb-4">Amount: NPR {paymentData.total_amount}</p>
                        <p className="text-sm text-gray-500 mb-6">You will be redirected to eSewa securely</p>
                    </>
                )}
                
                {/* Hidden eSewa Form */}
                <form 
                    id="esewaPaymentForm"
                    action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" 
                    method="POST"
                    className="hidden"
                >
                    <input type="text" name="amount" value={paymentData.amount} readOnly />
                    <input type="text" name="tax_amount" value={paymentData.tax_amount} readOnly />
                    <input type="text" name="total_amount" value={paymentData.total_amount} readOnly />
                    <input type="text" name="transaction_uuid" value={paymentData.transaction_uuid} readOnly />
                    <input type="text" name="product_code" value={paymentData.product_code} readOnly />
                    <input type="text" name="product_service_charge" value={paymentData.product_service_charge} readOnly />
                    <input type="text" name="product_delivery_charge" value={paymentData.product_delivery_charge} readOnly />
                    <input type="text" name="success_url" value={paymentData.success_url} readOnly />
                    <input type="text" name="failure_url" value={paymentData.failure_url} readOnly />
                    <input type="text" name="signed_field_names" value={paymentData.signed_field_names} readOnly />
                    <input type="text" name="signature" value={paymentData.signature} readOnly />
                </form>

                {/* Manual submit button as fallback */}
                {!isSubmitting && (
                    <div className="mt-6">
                        <button 
                            onClick={() => {
                                setIsSubmitting(true);
                                document.getElementById('esewaPaymentForm').submit();
                            }}
                            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold w-full"
                        >
                            Pay NPR {paymentData.total_amount} with eSewa
                        </button>
                        <p className="text-xs text-gray-500 mt-3">
                            Secure payment powered by eSewa
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EsewaPaymentForm;