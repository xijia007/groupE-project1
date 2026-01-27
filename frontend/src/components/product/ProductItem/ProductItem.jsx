import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity, selectItemQuantity, addToCartBackend, updateCartBackend } from "../../../features/cart/slices/cartSlice";
import { useToast } from "../../../features/toast/contexts/ToastContext";
import { useAuth } from "../../../features/auth/contexts/AuthContext";
import "./ProductItem.css";

function ProductItem({ product, userRole }) {
  const dispatch = useDispatch();
  const cartQuantity = useSelector(selectItemQuantity(product.id));
  // Remove local quantity state, rely on Redux
  // const [quantity, setQuantity] = useState(cartQuantity); 
  const { showToast } = useToast();
  const { isLoggedIn } = useAuth();

  const handleAdd = () => {
    const stock = Number(product.stock ?? 0);
    if (stock <= 0) {
      showToast("Out of stock!", "error");
      return;
    }
    
    if (isLoggedIn) {
      dispatch(addToCartBackend({ 
        productId: product.id, 
        quantity: 1 
      }));
    } else {
      dispatch(addToCart({ product, quantity: 1 }));
    }
    showToast("Added to cart", "success");
  };

  const handleIncrement = () => {
    const stock = Number(product.stock ?? Infinity);
    const newQuantity = cartQuantity + 1;
    
    if (stock !== Infinity && newQuantity > stock) {
      showToast(`Cannot add more than ${stock} items`, "warning");
      return;
    }
    
    if (isLoggedIn) {
      dispatch(updateCartBackend({ 
        productId: product.id, 
        quantity: newQuantity 
      }));
    } else {
      dispatch(updateQuantity({ productId: product.id, quantity: newQuantity }));
    }
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(0, cartQuantity - 1);
    
    if (isLoggedIn) {
      dispatch(updateCartBackend({ 
        productId: product.id, 
        quantity: newQuantity 
      }));
    } else {
      dispatch(updateQuantity({ productId: product.id, quantity: newQuantity }));
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-card-image">
          <img src={product.img_url} alt={product.name} />
        </div>
        <div className="product-card-body">
          <div className="product-card-name">{product.name}</div>
          <div className="product-card-price">${product.price}</div>
        </div>
      </Link>
      <div className="product-card-button">
        {cartQuantity === 0 ? (
          <button
            className="product-card-add"
            type="button"
            onClick={handleAdd}
          >
            Add
          </button>
        ) : (
          <div className="product-card-qty">
            <button className="qty-btn" type="button" onClick={handleDecrement}>
              -
            </button>
            <span className="qty-value">{cartQuantity}</span>
            <button className="qty-btn" type="button" onClick={handleIncrement}>
              +
            </button>
          </div>
        )}
        {userRole === "admin" && (
          <Link to={`/products/${product.id}/edit`}>
            <button className="product-card-edit" type="button">
              Edit
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default ProductItem;
