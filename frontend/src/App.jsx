import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./assets/components/Footer/index.jsx";
import Header from "./assets/components/Header/index.jsx";
import SignIn from "./assets/components/SignInModal/SignIn.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import EditProduct from "./pages/EditProduct.jsx";

function AppContent() {
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    setShowSignIn(false);
    navigate("/");
  };

  return (
    <>
      <Header
        onSignInClick={() => setShowSignIn(true)}
        onHomeClick={handleHomeClick}
      />
      <main className="mainContainer">
        {showSignIn ? (
          <SignIn onClose={() => setShowSignIn(false)} />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products/:id/edit" element={<EditProduct />} />
          </Routes>
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
