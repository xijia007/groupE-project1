import "./Header.css";
import { FaRegUser, FaSearch } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
// import { Link, useLocation, useNavigate } from "react-router-dom";

function Header({ onSignInClick, onHomeClick, onCartClick, isLoggedIn }) {
  // const navigate = useNavigate();
  // const location = useLocation();

  // const handleCartClick = () => {
  //   navigate('/cart', { state: { backgroundLocation: location }});
  // };

  return (
    <header className="site-header">
      <div className="site-header-brand" onClick={onHomeClick}>
        <span className="brand-title">Management</span>
        <span className="brand-title-short">M</span>
        <span className="brand-subtitle">Chuwa</span>
      </div>
      <div className="site-header-search">
        <input type="text" placeholder="Search" />
        <FaSearch className="search-icon" />
      </div>
      <div className="site-header-right">
        <div className="site-header-userAuth" onClick={onSignInClick}>
          <FaRegUser className="site-header-image" />
          <span className="site-header-login">
            {isLoggedIn ? "Logout" : "Sign In"}
          </span>
        </div>
        {
          <div className="site-header-cart" onClick={onCartClick}>
            <MdOutlineShoppingCart className="cart-icon" />
            <span className="cart-price">$0.00</span>
          </div>
        }
      </div>
    </header>
  );
}

export default Header;
