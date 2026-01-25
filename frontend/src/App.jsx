import { useEffect, useState } from "react";
import Footer from "./assets/components/Footer/index.jsx";
import Header from "./assets/components/Header/index.jsx";
import SignIn from "./assets/components/SignModal/SignIn.jsx";
import SignUp from "./assets/components/SignModal/SignUp.jsx";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useCartSync } from "./hooks/useCartSync.js";
import CreateProduct from "./pages/CreateProduct.jsx";
// import productsData from './assets/data/mock_products.json';


function AppContent() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  
  // 🔄 自动同步购物车（登录/登出时）
  useCartSync();
  
  // const [products, setProducts] = useState(productsData);


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


  // const handleCreateProduct = (newProduct) => {
  //   const productWithId = {
  //     ...newProduct,
  //     id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  //   };
  //   setProducts((prev) => [productWithId, ...prev]);
  // };

  // const handleUpdateProduct = (updatedProduct) => {
  //   setProducts((prev) => 
  //     prev.map((item) => (item.id === updatedProduct.id ? updatedProduct : item)));
  //   navigate("/signin", { state: { from: location } });
  // };

  const handleCartClick = () => {
    if (location.pathname === "/cart") return;
    navigate("/cart", { state: { backgroundLocation: location } });
  };

  const requireAuth = (element) => {
    if (isLoggedIn) return element;
    return <Navigate to="/signin" replace state={{ from: location }} />;
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
              <Route path="/SignIn" element={<Navigate to="/signin" replace />} />
              <Route path="/SignUp" element={<Navigate to="/signup" replace />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route 
                path="/createProduct" 
                element={<CreateProduct />} 
              />
              <Route 
                path="/products/:id/edit" 
                element={<EditProduct />} 
              />
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
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
