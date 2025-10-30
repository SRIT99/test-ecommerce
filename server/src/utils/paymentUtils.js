const crypto = require('crypto');

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

module.exports = {
    generateEsewaSignature,
    createSignatureMessage
};