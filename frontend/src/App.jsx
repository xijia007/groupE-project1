import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./assets/components/Footer/index.jsx";
import Header from "./assets/components/Header/index.jsx";
import SignIn from "./assets/components/SignInModal/SignIn.jsx";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";

  function AppContent() {
    const [showSignIn, setShowSignIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const backgroundLocation = location.state?.backgroundLocation;

    console.log("path:", location.pathname, "bg:", backgroundLocation?.pathname);
    const handleHomeClick = () => {
      setShowSignIn(false);
      navigate("/");
    };

    const handleCartClick = () => {
      if (location.pathname === '/cart') return;
      navigate('/cart', { state: { backgroundLocation: location }});
    }

    return (
      <>
        <Header
          onSignInClick={() => setShowSignIn(true)}
          onHomeClick={handleHomeClick}
          onCartClick={handleCartClick}
        />
        <main className="mainContainer">
          {showSignIn ? (
            <SignIn onClose={() => setShowSignIn(false)} />
          ) : (
            <>
              <Routes location={backgroundLocation || location}>
                <Route path="/" element={<Home />} />
                <Route path="/products/:id" element={<ProductDetail />} />
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
