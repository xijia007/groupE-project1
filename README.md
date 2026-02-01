# Group E Project 1 - Full Stack E-Commerce Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v14 or higher)
*   [MongoDB](https://www.mongodb.com/) (Ensure your connection string is ready)

## 🚀 Getting Started

To run this project locally, you need to start both the backend server and the frontend application.

### 1. Backend Setup

The backend runs on `http://localhost:3000` (default).

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the server:
    ```bash
    npm start
    ```
    > The server should start cleanly. Ensure your MongoDB connection string is correctly configured in the source code or environment variables.

### 2. Frontend Setup

The frontend runs on `http://localhost:5173` (Vite default).

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and visit the URL shown in the terminal (usually `http://localhost:5173`).

## 🛠 Features

*   **User Authentication**: Sign Up, Sign In, Password Management inside Profile.
*   **Product Management**: Browse products, search, pagination.
*   **Shopping Cart**: Add to cart, adjust quantities, real-time calculation, coupons.
*   **Admin Dashboard**: Create and edit products (requires 'admin' role).
*   **Responsive Design**: optimized for both desktop and mobile views.

## 📁 Project Structure

```
groupE-project1/
├── backend/                          # Backend server (Node.js + Express)
│   ├── src/
│   │   ├── app.js                   # Main Express application entry point
│   │   ├── config.js                # Database and server configuration
│   │   ├── constants/
│   │   │   └── errorCodes.js        # Standardized error codes and messages
│   │   ├── controllers/             # Business logic handlers
│   │   │   ├── auth_controller.js   # Authentication (register, login, profile)
│   │   │   ├── cart_controller.js   # Shopping cart CRUD operations
│   │   │   ├── Coupon_controller.js # Coupon verification and management
│   │   │   ├── Product_controller.js # Product CRUD operations
│   │   │   └── user_controller.js   # User profile management
│   │   ├── middlewares/             # Express middleware functions
│   │   │   ├── adminCheck.js        # Admin role verification
│   │   │   ├── auth.js              # JWT token verification
│   │   │   └── errorHandler.js      # Global error handling middleware
│   │   ├── models/                  # Data models (schema definitions)
│   │   │   ├── Coupon.js            # Coupon model schema
│   │   │   ├── Products.js          # Product model schema
│   │   │   └── User.js              # User model schema
│   │   ├── routers/                 # API route definitions
│   │   │   ├── auth_routers.js      # Auth endpoints (/api/auth/*)
│   │   │   ├── cart_routers.js      # Cart endpoints (/api/cart/*)
│   │   │   ├── coupon_routers.js    # Coupon endpoints (/api/coupons/*)
│   │   │   ├── database.js          # Database connection setup
│   │   │   └── product_routers.js   # Product endpoints (/api/products/*)
│   │   ├── scripts/                 # Utility scripts
│   │   │   ├── add_global_coupon.js # Script to add coupon codes to DB
│   │   │   └── check_coupons.js     # Script to verify coupon data
│   │   └── utils/                   # Helper utilities
│   │       ├── errorResponse.js     # Error response formatter
│   │       └── jwt.js               # JWT token generation/verification
│   └── package.json                 # Backend dependencies
│
├── frontend/                         # Frontend application (React + Vite)
│   ├── src/
│   │   ├── App.jsx                  # Main app component with routing
│   │   ├── main.jsx                 # React app entry point
│   │   ├── index.css                # Global CSS styles
│   │   ├── assets/
│   │   │   ├── app/
│   │   │   │   └── store.js         # Redux store configuration
│   │   │   └── data/
│   │   │       └── mock_products.json # Mock product data (if needed)
│   │   ├── components/              # Reusable UI components
│   │   │   ├── auth/
│   │   │   │   ├── Auth.jsx         # Unified auth form (Sign In/Up/Reset)
│   │   │   │   └── Auth.css         # Auth form styling
│   │   │   ├── layout/
│   │   │   │   ├── Header/
│   │   │   │   │   ├── index.jsx    # Site header with nav and search
│   │   │   │   │   └── Header.css   # Header styling
│   │   │   │   ├── Footer/
│   │   │   │   │   ├── index.jsx    # Site footer
│   │   │   │   │   └── Footer.css   # Footer styling
│   │   │   │   └── ProtectedRoute.jsx # Route guard for auth/role checks
│   │   │   └── product/
│   │   │       ├── Pagination/
│   │   │       │   ├── Pagination.jsx # Pagination controls
│   │   │       │   └── Paginations.css # Pagination styling
│   │   │       ├── ProductForm/
│   │   │       │   ├── ProductForm.jsx # Reusable create/edit form
│   │   │       │   └── ProductForm.css # Form styling
│   │   │       ├── ProductItem/
│   │   │       │   ├── ProductItem.jsx # Single product card
│   │   │       │   └── ProductItem.css # Card styling
│   │   │       └── ProductList/
│   │   │           ├── ProductList.jsx # Product grid container
│   │   │           └── ProductList.css # Grid styling
│   │   ├── features/                # Feature-specific modules
│   │   │   ├── auth/
│   │   │   │   ├── contexts/
│   │   │   │   │   └── AuthContext.jsx # Global auth state (Context API)
│   │   │   │   └── hooks/
│   │   │   │       └── useAuthSync.js # Auth synchronization hook
│   │   │   ├── cart/
│   │   │   │   ├── slices/
│   │   │   │   │   └── cartSlice.js # Redux cart state + async thunks
│   │   │   │   └── hooks/
│   │   │   │       └── useCartSync.js # Cart sync hook for logged-in users
│   │   │   ├── products/
│   │   │   │   └── slices/
│   │   │   │       └── productsSlice.js # Redux products state + fetch logic
│   │   │   └── toast/
│   │   │       └── contexts/
│   │   │           ├── ToastContext.jsx # Global toast notification system
│   │   │           └── Toast.css    # Toast styling
│   │   └── pages/                   # Page-level components
│   │       ├── auth/
│   │       │   ├── SignIn/
│   │       │   │   └── SignInPage.jsx # Sign In page wrapper
│   │       │   ├── SignUp/
│   │       │   │   └── SignUpPage.jsx # Sign Up page wrapper
│   │       │   └── ForgotPassword/
│   │       │       └── ForgotPasswordPage.jsx # Password reset page
│   │       ├── Home/
│   │       │   ├── Home.jsx         # Homepage with product grid
│   │       │   └── Home.css         # Homepage styling
│   │       ├── ProductDetail/
│   │       │   ├── ProductDetail.jsx # Product detail page
│   │       │   └── ProductDetail.css # Detail page styling
│   │       ├── Cart/
│   │       │   ├── Cart.jsx         # Shopping cart sidebar
│   │       │   └── Cart.css         # Cart styling (responsive)
│   │       ├── Checkout/
│   │       │   ├── Checkout.jsx     # Checkout page with form
│   │       │   └── Checkout.css     # Checkout styling
│   │       ├── CreateProduct/
│   │       │   └── CreateProduct.jsx # Admin product creation page
│   │       ├── EditProduct/
│   │       │   ├── EditProduct.jsx  # Admin product edit page
│   │       │   └── EditProduct.css  # Edit page styling
│   │       ├── UserProfile/
│   │       │   ├── Profile.jsx      # User profile management
│   │       │   └── Profile.css      # Profile page styling
│   │       └── NotFound/
│   │           ├── NotFound.jsx     # 404 error page
│   │           └── NotFound.css     # 404 page styling
│   ├── package.json                 # Frontend dependencies
│   └── vite.config.js               # Vite build configuration
│
├── PROJECT_TASK_LIST.md             # Task distribution and requirements
└── README.md                        # This file
```

## 🗂 Key File Descriptions

### Backend Core Files

| File | Purpose |
|------|---------|
| `app.js` | Express server setup, middleware registration, route mounting |
| `config.js` | MongoDB connection string and server port configuration |
| `errorCodes.js` | Centralized error code constants (e.g., `AUTH_001`, `PRODUCT_404`) |
| `errorHandler.js` | Global error handling middleware for consistent API responses |
| `auth.js` (middleware) | JWT token verification and user authentication |
| `jwt.js` (utils) | Token generation and verification helper functions |

### Frontend Core Files

| File | Purpose |
|------|---------|
| `App.jsx` | Main routing configuration and app structure |
| `store.js` | Redux store setup with cart and products slices |
| `AuthContext.jsx` | Global authentication state using React Context API |
| `ToastContext.jsx` | Global toast notification system for user feedback |
| `ProtectedRoute.jsx` | Route guard component for authentication and role-based access |
| `cartSlice.js` | Redux slice for cart state with optimistic UI updates |
| `productsSlice.js` | Redux slice for product data fetching and caching |

### Reusable Components

| Component | Purpose |
|-----------|---------|
| `Auth.jsx` | Unified authentication form (handles Sign In, Sign Up, Password Reset) |
| `ProductForm.jsx` | Reusable form for both creating and editing products |
| `ProductItem.jsx` | Individual product card displayed in grid |
| `Pagination.jsx` | Pagination controls for product lists |
| `Header/index.jsx` | Site navigation with search, cart icon, and user menu |
| `Footer/index.jsx` | Site footer with links and copyright |

## 🔐 Security Features

*   **Password Hashing**: bcrypt with salt rounds
*   **JWT Authentication**: Stateless token-based auth
*   **Role-Based Access Control**: Admin vs. Regular user permissions
*   **Protected Routes**: Frontend and backend route guards
*   **Input Validation**: Client-side (React) and server-side (Zod)

## 🎨 Styling Approach

*   **Vanilla CSS**: No CSS frameworks, full control over styling
*   **CSS Variables**: Consistent color scheme and spacing
*   **Responsive Design**: Mobile-first with media queries
*   **Component-Scoped CSS**: Each component has its own CSS file

## 📚 Additional Resources

*   **PROJECT_TASK_LIST.md**: Team task distribution
