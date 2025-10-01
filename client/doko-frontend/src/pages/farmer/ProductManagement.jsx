import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom'; // Add useNavigate
import { productService } from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';
import ProductForm from './ProductForm'; // Make sure this import is correct

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Add navigate
    const { user } = useAuth();

    const action = searchParams.get('action');
    const editId = searchParams.get('id');

    useEffect(() => {
        // Only fetch products if we're not in add/edit mode
        if (!action) {
            fetchProducts();
        }
    }, [action]); // Add action as dependency

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getProducts();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProduct = () => {
        // After saving, go back to product list and refresh
        navigate('/farmer/dashboard/products');
        fetchProducts(); // Refresh the product list
    };

    const handleCancel = () => {
        navigate('/farmer/dashboard/products');
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            // TODO: Add delete endpoint in backend
            // await productService.deleteProduct(productId);
            setProducts(products.filter(p => p._id !== productId));
        } catch (err) {
            setError('Failed to delete product');
        }
    };

    // Debug: Check if action is detected
    console.log('Current action:', action);
    console.log('Current editId:', editId);

    // Show product form if action is add/edit
    if (action === 'add' || action === 'edit') {
        return (
            <ProductForm
                productId={editId}
                onSave={handleSaveProduct}
                onCancel={handleCancel}
            />
        );
    }

    // Rest of your existing component for product list view...
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-600">Manage your farm products and inventory</p>
                </div>
                <Link
                    to="?action=add"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-green-200 transition-all duration-200 transform hover:scale-105"
                >
                    + Add New Product
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Products Grid - your existing product list code */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50 animate-pulse">
                            <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-10 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-green-100/50">
                            <div className="text-6xl mb-4">🌱</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
                            <p className="text-gray-600 mb-6">Start by adding your first product to sell</p>
                            <Link
                                to="?action=add"
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Add Your First Product
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product._id} className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    {/* Your existing product card code */}
                                    <div className="relative h-48 bg-gray-200 rounded-xl mb-4 overflow-hidden">
                                        <img
                                            src={product.imageUrl || '/api/placeholder/300/200'}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-semibold text-gray-900">
                                            {product.stockQty || 0} in stock
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                                        <span className="text-sm text-gray-500">per {product.unit}</span>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Link
                                            to={`?action=edit&id=${product._id}`}
                                            className="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteProduct(product._id)}
                                            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductManagement;

// import React, { useState, useEffect } from 'react';
// import { Link, useSearchParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';

// const ProductManagement = () => {
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();
//     const { user } = useAuth();

//     const action = searchParams.get('action');
//     const editId = searchParams.get('id');

//     console.log('🔍 DEBUG - Action:', action, 'Edit ID:', editId);
//     console.log('🔍 DEBUG - Full URL:', window.location.href);

//     // Show product form if action is add/edit
//     if (action === 'add' || action === 'edit') {
//         return (
//             <div className="p-6">
//                 <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//                     <strong>SUCCESS!</strong> Product form should be visible now.
//                     <br />
//                     Action: {action} | ID: {editId || 'N/A'}
//                 </div>

//                 {/* Simple test form */}
//                 <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100/50">
//                     <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                         {action === 'add' ? 'Add New Product' : 'Edit Product'}
//                     </h2>
//                     <p className="text-gray-600 mb-6">
//                         {action === 'add' ? 'Add a new product to your farm' : `Editing product ${editId}`}
//                     </p>

//                     <div className="space-y-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Product Name
//                             </label>
//                             <input
//                                 type="text"
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                                 placeholder="Enter product name"
//                             />
//                         </div>

//                         <div className="flex space-x-4">
//                             <button
//                                 onClick={() => navigate('/farmer/dashboard/products')}
//                                 className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
//                             >
//                                 Save Product
//                             </button>
//                             <button
//                                 onClick={() => navigate('/farmer/dashboard/products')}
//                                 className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // Product list view
//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
//                     <p className="text-gray-600">Manage your farm products</p>
//                 </div>
//                 <Link
//                     to="?action=add"
//                     className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-green-200 transition-all duration-200"
//                     onClick={() => console.log('🎯 Add Product button clicked!')}
//                 >
//                     + Add New Product
//                 </Link>
//             </div>

//             <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
//                 <strong>DEBUG INFO:</strong>
//                 <br />- Current action: {action || 'none'}
//                 <br />- Click "Add New Product" above to test
//             </div>

//             <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
//                 <div className="text-6xl mb-4">🌱</div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Management</h3>
//                 <p className="text-gray-600">Click "Add New Product" to test the form</p>
//             </div>
//         </div>
//     );
// };

// export default ProductManagement;