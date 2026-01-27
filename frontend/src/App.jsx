import { useEffect, useState } from "react";
import Footer from "./components/layout/Footer/index.jsx";
import Header from "./components/layout/Header/index.jsx";
import SignIn from "./components/auth/SignInModal/SignInModal.jsx";
import SignUp from "./components/auth/SignUpModal/SignUpModal.jsx";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import ProductDetail from "./pages/ProductDetail/ProductDetail.jsx";
import EditProduct from "./pages/EditProduct/EditProduct.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import SignInPage from "./pages/auth/SignIn/SignInPage.jsx";
import SignUpPage from "./pages/auth/SignUp/SignUpPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPassword/ForgotPasswordPage.jsx";
import { useAuth } from "./features/auth/contexts/AuthContext.jsx";
import { useCartSync } from "./features/cart/hooks/useCartSync.js";
import { ToastProvider } from "./features/toast/contexts/ToastContext.jsx";
import CreateProduct from "./pages/CreateProduct/CreateProduct.jsx";

function AppContent() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  // 🔄 自动同步购物车（登录/登出时）
  useCartSync();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleUserAuthClick = () => {
    if (isLoggedIn) {
      logout();
      navigate("/signin", { replace: true });
      return;
    }
    navigate("/signin", { state: { from: location } });
  };

  const handleCartClick = () => {
    if (location.pathname === "/cart") return;
    navigate("/cart", { state: { backgroundLocation: location } });
  };

  return (
    <>
      <Header
        onSignInClick={handleUserAuthClick}
        onHomeClick={handleHomeClick}
        onCartClick={handleCartClick}
        isLoggedIn={isLoggedIn}
      />
      <main className="mainContainer">
        <>
          <Routes location={backgroundLocation || location}>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/SignIn" element={<Navigate to="/signin" replace />} />
            <Route path="/SignUp" element={<Navigate to="/signup" replace />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/createProduct" element={<CreateProduct />} />
            <Route path="/products/:id/edit" element={<EditProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>

          {backgroundLocation && (
            <Routes>
              <Route path="/cart" element={<Cart />} />
            </Routes>
          )}
        </>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
