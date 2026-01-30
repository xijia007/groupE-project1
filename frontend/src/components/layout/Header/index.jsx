import "./Header.css";
import { useEffect, useRef, useState } from "react";
import {
  clearSearch,
  searchProducts,
  setQuery,
} from "../../../features/products/slices/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../features/auth/contexts/AuthContext";
import { FaRegUser, FaSearch, FaStar, FaLeaf } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import {
  selectCartTotalItems,
  selectCartTotalPrice,
} from "../../../features/cart/slices/cartSlice";
import { useNavigate } from "react-router-dom";

function Header({ onSignInClick, onHomeClick, onCartClick, isLoggedIn }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(setQuery(value));
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    const trimmed = value.trim();
    if (!trimmed) {
      dispatch(clearSearch());
      return;
    }

    debounceRef.current = setTimeout(() => {
      dispatch(searchProducts(trimmed));
    }, 300);
  };
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="site-header">
      <div className="site-header-brand" onClick={onHomeClick}>
        <span className="brand-title">Management</span>
        <span className="brand-title-short">M</span>
        <span className="brand-subtitle">Chuwa</span>
      </div>
      <div className="site-header-search">
        <input
          type="text"
          placeholder="Search"
          onChange={handleSearch}
          value={searchTerm}
        />
        <FaSearch className="search-icon" />
      </div>
      <div className="site-header-right">
        <div className="site-header-userAuth">
          <div className="user-icon-container" style={{ position: "relative" }}>
            <FaRegUser
              className="site-header-image"
              onClick={handleProfileClick}
            />
            {isLoggedIn && user?.role === "admin" && (
              <FaStar className="user-badge user-badge-admin" />
            )}
            {isLoggedIn &&
              (user?.role === "regular" || user?.role === "user") && (
                <FaLeaf className="user-badge user-badge-regular" />
              )}
          </div>
          <span className="site-header-login" onClick={onSignInClick}>
            {isLoggedIn ? "Logout" : "Sign In"}
          </span>
        </div>

        <div className="site-header-cart" onClick={onCartClick}>
          <div className="cart-icon-wrapper">
            <MdOutlineShoppingCart className="cart-icon" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </div>
          <span className="cart-price">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
