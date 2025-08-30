import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-700 dark:text-blue-200">Contact Us</h1>
      <p className="text-xl text-slate-700 dark:text-slate-300 mb-8">
        We'd love to hear from you! Reach out to us using the details below or visit us at our office.
      </p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Contact Details</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">Phone: <a href="tel:+9779800000000" className="text-blue-600 hover:underline">+977-9800000000</a></p>
        <p className="text-lg text-slate-600 dark:text-slate-400">Email: <a href="mailto:info@doko.com" className="text-blue-600 hover:underline">info@doko.com</a></p>
        <p className="text-lg text-slate-600 dark:text-slate-400">Address: Dharan-14, Sunsari, Nepal</p>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Location</h2>
        <div className="flex justify-center">
          <iframe
            title="Doko Location"
            src="https://www.google.com/maps?q=26.8144,87.2797&z=15&output=embed"
            width="100%"
            height="350"
            style={{ border: 0, maxWidth: '600px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
