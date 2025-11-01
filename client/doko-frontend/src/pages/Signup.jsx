// src/components/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        location: '',
        userType: 'buyer'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userTypeFromUrl = searchParams.get('type');

    React.useEffect(() => {
        if (userTypeFromUrl === 'farmer') {
            setFormData(prev => ({ ...prev, userType: 'seller' }));
        }
    }, [userTypeFromUrl]);

    // Enhanced email validation function
    const validateEmail = (email) => {
        if (!email) {
            return 'Email is required';
        }

        // Basic email format validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }

        // Check if email starts with number or underscore
        if (/^[0-9_]/.test(email)) {
            return 'Email should not start with a number or underscore';
        }

        // Check for invalid special characters (only @, ., -, _ are allowed in specific positions)
        const invalidChars = /[^a-zA-Z0-9@._-]/;
        if (invalidChars.test(email.split('@')[0])) {
            return 'Email contains invalid characters';
        }

        // Validate domain format
        const [localPart, domain] = email.split('@');
        if (!domain || domain.length < 3 || !domain.includes('.')) {
            return 'Please enter a valid email domain';
        }

        // Check domain extension
        const domainParts = domain.split('.');
        const extension = domainParts[domainParts.length - 1];
        const validExtensions = ['com', 'org', 'net', 'edu', 'gov', 'io', 'co', 'in', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn'];

        if (extension.length < 2 || extension.length > 6) {
            return 'Please enter a valid email domain extension';
        }

        return '';
    };

    // Validation functions
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    error = 'Name is required';
                } else if (!/^[a-zA-Z\s]{2,50}$/.test(value)) {
                    error = 'Name should only contain letters and spaces (2-50 characters)';
                }
                break;

            case 'email':
                error = validateEmail(value);
                break;

            case 'phone':
                if (!value) {
                    error = 'Phone number is required';
                } else if (!/^\d{10,15}$/.test(value.replace(/\D/g, ''))) {
                    error = 'Please enter a valid phone number (10-15 digits)';
                }
                break;

            case 'location':
                if (!value.trim()) {
                    error = 'Location is required';
                } else if (value.length < 3) {
                    error = 'Location should be at least 3 characters long';
                }
                break;

            case 'password':
                if (!value) {
                    error = 'Password is required';
                } else if (value.length < 6) {
                    error = 'Password must be at least 6 characters long';
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    error = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
                }
                break;

            default:
                break;
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        let processedValue = value;

        // Handle phone number input - only allow numbers
        if (name === 'phone') {
            // Remove all non-digit characters
            processedValue = value.replace(/\D/g, '');
        }

        setFormData({
            ...formData,
            [name]: processedValue,
        });

        // Real-time validation
        const error = validateField(name, processedValue);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Handle phone number input to prevent non-numeric characters
    const handlePhoneKeyPress = (e) => {
        // Allow only numbers and common navigation keys
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
            'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
        ];

        if (allowedKeys.includes(e.key)) {
            return;
        }

        // Prevent non-numeric characters
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    };

    // Handle paste event for phone field to clean up non-numeric characters
    const handlePhonePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const numbersOnly = pastedText.replace(/\D/g, '');

        // Update form data with cleaned value
        setFormData(prev => ({
            ...prev,
            phone: numbersOnly
        }));

        // Validate the cleaned value
        const error = validateField('phone', numbersOnly);
        setErrors(prev => ({
            ...prev,
            phone: error
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        Object.keys(formData).forEach(key => {
            if (key !== 'userType') { // Skip userType validation
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await authService.signup(formData);

            navigate('/login', {
                state: {
                    message: 'Account created successfully! Please login.',
                    email: formData.email
                }
            });

        } catch (err) {
            const errorMessage = err.response?.data?.error ||
                err.message ||
                'Signup failed. Please try again.';

            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const getInputClassName = (fieldName) => {
        const baseClass = "mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:z-10 sm:text-sm";

        if (errors[fieldName]) {
            return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`;
        }

        return `${baseClass} border-gray-300 focus:ring-green-500 focus:border-green-500`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">D</span>
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                            {errors.submit}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className={getInputClassName('name')}
                                placeholder="Enter your full name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={getInputClassName('email')}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone Field - Updated to handle numbers only */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                onKeyDown={handlePhoneKeyPress}
                                onPaste={handlePhonePaste}
                                className={getInputClassName('phone')}
                                placeholder="Enter your phone number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Numbers only (10-15 digits)
                            </p>
                        </div>

                        {/* Location Field */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                className={getInputClassName('location')}
                                placeholder="Enter your location"
                            />
                            {errors.location && (
                                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                            )}
                        </div>

                        {/* User Type Field */}
                        <div>
                            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                                I want to
                            </label>
                            <select
                                id="userType"
                                name="userType"
                                value={formData.userType}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                            >
                                <option value="buyer">Buy products</option>
                                <option value="seller">Sell my products</option>
                            </select>
                        </div>

                        {/* Password Field with Eye Icon */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={getInputClassName('password') + " pr-10"}
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Password must be at least 6 characters with uppercase, lowercase, and number
                            </p>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </div>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm text-green-600 hover:text-green-500"
                        >
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;