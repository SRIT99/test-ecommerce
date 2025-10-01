export const testAllRoutes = () => {
    const routes = [
        '/',
        '/login',
        '/signup',
        '/products',
        '/farmer/dashboard',
        '/farmer/dashboard/products',
        '/farmer/dashboard/orders',
        '/farmer/dashboard/profile'
    ];

    routes.forEach(route => {
        console.log(`Testing route: ${route}`);
    });
};