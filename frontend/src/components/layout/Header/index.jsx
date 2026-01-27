import "./Header.css";
import { FaRegUser, FaSearch } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";
import { selectCartTotalItems, selectCartTotalPrice } from "../../../features/cart/slices/cartSlice";
// import { Link, useLocation, useNavigate } from "react-router-dom";

function Header({ onSignInClick, onHomeClick, onCartClick, isLoggedIn }) {
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  
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

        <div className="site-header-cart" onClick={onCartClick}>
          <div className="cart-icon-wrapper">
            <MdOutlineShoppingCart className="cart-icon" />
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </div>
          <span className="cart-price">${totalPrice.toFixed(2)}</span>
        </div>
 
      </div>
    </header>
  );
}

export default Header;
