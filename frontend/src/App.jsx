import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./assets/components/Footer/index.jsx";
import Header from "./assets/components/Header/index.jsx";
import SignIn from "./assets/components/SignModal/SignIn.jsx";
import SignUp from "./assets/components/SignModal/SignUp.jsx";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import CreateProduct from "./pages/CreateProduct.jsx";
import productsData from './assets/data/mock_products.json';

function AppContent() {
  const [authModal, setAuthModal] = useState(null);
  const [authTick, setAuthTick] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
  const [products, setProducts] = useState(productsData);

  const handleHomeClick = () => {
    setAuthModal(null);
    navigate("/");
  };

  const handleUserAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("accessToken");
      setAuthModal(null);
      setAuthTick((t) => t + 1);
      if (location.pathname === "/cart") {
        navigate("/", { replace: true });
      }
      return;
    }
    setAuthModal("signin");
  };

  const handleCreateProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    };
    setProducts((prev) => [productWithId, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) => 
      prev.map((item) => (item.id === updatedProduct.id ? updatedProduct : item)));
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      setAuthModal("signin");
      return;
    }
    if (location.pathname === "/cart") return;
    navigate("/cart", { state: { backgroundLocation: location } });
  };

  useEffect(() => {
    if (location.pathname === "/cart" && !isLoggedIn) {
      queueMicrotask(() => setAuthModal("signin"));
      navigate("/", { replace: true });
    }
  }, [location.pathname, isLoggedIn, navigate, authTick]);

  return (
    <>
      <Header
        onSignInClick={handleUserAuthClick}
        onHomeClick={handleHomeClick}
        onCartClick={handleCartClick}
        isLoggedIn={isLoggedIn}
      />
      <main className="mainContainer">
        {authModal ? (
          authModal === "signup" ? (
            <SignUp
              onClose={() => setAuthModal(null)}
              onSignIn={() => setAuthModal("signin")}
              onAuthSuccess={() => setAuthTick((t) => t + 1)}
            />
          ) : (
            <SignIn
              onClose={() => setAuthModal(null)}
              onSignUp={() => setAuthModal("signup")}
              onAuthSuccess={() => setAuthTick((t) => t + 1)}
            />
          )
        ) : (
          <>
            <Routes location={backgroundLocation || location}>
              <Route path="/" element={<Home products={products} />} />
              <Route path="/products/:id" element={<ProductDetail products={products} />} />
              <Route 
                path="/createProduct" 
                element={<CreateProduct products={products} onCreateProduct={handleCreateProduct}/>} 
              />
              <Route 
                path="/products/:id/edit" 
                element={<EditProduct products={products} onUpdateProduct={handleUpdateProduct} />} 
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
        )}
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