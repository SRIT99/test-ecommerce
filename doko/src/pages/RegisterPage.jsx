import React from 'react'

const RegisterPage = ({ setCurrentPage, setCurrentUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'buyer',
        phone: '',
        location: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear error when field is edited
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.location) newErrors.location = 'Location is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Simulate registration - in a real app, this would be an API call
            setCurrentUser({
                name: formData.name,
                email: formData.email,
                type: formData.userType
            });
            setCurrentPage('dashboard');
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                        Join DOKO as a buyer, seller, or administrator
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="userType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                I want to join as a
                            </label>
                            <select
                                id="userType"
                                name="userType"
                                value={formData.userType}
                                onChange={handleChange}
                                className="relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-white dark:bg-slate-700"
                            >
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller/Farmer</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="name" className="sr-only">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-white dark:bg-slate-700"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-white dark:bg-slate-700"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="phone" className="sr-only">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                className="relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-white dark:bg-slate-700"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                        </div>

                        <div>
                            <label htmlFor="location" className="sr-only">
                                Location
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                required
                                className="relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-white dark:bg-slate-700"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-white dark:bg-slate-700"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-white dark:bg-slate-700"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                            required
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                            I agree to the <a href="#" className="font-medium text-primary hover:text-primary-dark">Terms and Conditions</a>
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Create Account
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Already have an account?{' '}
                            <a
                                href="#"
                                className="font-medium text-primary hover:text-primary-dark"
                                onClick={() => setCurrentPage('login')}
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default RegisterPage;