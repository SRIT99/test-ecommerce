
```markdown
# 🛍️ E-Commerce Web Application

A modern full-stack e-commerce platform built with React.js and Node.js, featuring user authentication, product management, shopping cart, and order processing.

## ✨ Features

### 🔐 Authentication System
- User registration and login
- JWT token-based authentication
- Protected routes
- Secure password handling

### 🛒 Shopping Experience
- Product catalog with categories
- Advanced search and filtering
- Shopping cart management
- Product reviews and ratings
- Wishlist functionality

### 💼 Order Management
- Secure checkout process
- Order history tracking
- Order status updates
- Invoice generation

### 👨‍💼 Admin Features
- Product management (Add/Edit/Delete)
- User management
- Order management
- Inventory tracking

### 📱 User Experience
- Responsive design for all devices
- Modern and clean UI
- Fast loading times
- Intuitive navigation

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **Context API** - State management
- **CSS3** - Styling and responsive design
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **BCrypt** - Password hashing

## 🚀 Installation & Setup

Follow these steps to set up the project locally:

### Prerequisites
Make sure you have the following installed:
- Node.js (version 14 or higher)
- MongoDB
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/SRIT99/test-ecommerce.git
cd test-ecommerce
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Create environment file
# Create a .env file in backend directory with following variables:
# MONGODB_URI=mongodb://localhost:27017/ecommerce
# JWT_SECRET=your_jwt_secret_key_here
# PORT=5000

# Start the backend server
npm start #to start in production mode
npm run dev #to start in development mode
```

### Step 3: Frontend Setup
```bash
# Open new terminal and navigate to frontend directory
cd client
cd doko-frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

### Step 4: Access the Application
- Frontend will run on: http://localhost:5173
- Backend API will run on: http://localhost:5000

## 📁 Project Structure

```
test-ecommerce/
├── backend/
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── config/          # Database configuration
│   └── server.js        # Server entry point
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # State management
│   │   ├── utils/       # Helper functions
│   │   └── App.js       # Main App component
│   └── package.json
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Orders
- `POST /orders` - Create new order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id` - Update order status

## 🔧 Environment Variables

Create a `.env` file in the backend directory with:

```env
#if you want environment file message me at surajworkspace12@gmail.com
MONGODB_URI=mongodb:yourMongoURI
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**SRIT99**
- GitHub: [@SRIT99](https://github.com/SRIT99)

## 🙏 Acknowledgments

- React.js community
- Express.js documentation
- MongoDB documentation
- All contributors and testers

---

**⭐ If you like this project, give it a star on GitHub!**
```
