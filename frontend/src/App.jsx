import Footer from "./assets/components/Footer/index.jsx";
import Header from "./assets/components/Header/index.jsx";
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

function AppContent() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  console.log("path:", location.pathname, "bg:", backgroundLocation?.pathname);
  const handleHomeClick = () => {
    navigate("/");
  };

  const handleUserAuthClick = () => {
    if (isLoggedIn) {
      logout();
      if (location.pathname === "/cart") {
        navigate("/", { replace: true });
      }
      return;
    }

    navigate("/signin", { state: { from: location } });
  };

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
            <Route path="/products/:id/edit" element={<EditProduct />} />
            <Route path="/cart" element={requireAuth(<Cart />)} />
            <Route path="/checkout" element={requireAuth(<Checkout />)} />
          </Routes>

          {backgroundLocation && (
            <Routes>
              <Route path="/cart" element={requireAuth(<Cart />)} />
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
