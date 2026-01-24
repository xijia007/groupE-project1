import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity, selectItemQuantity } from "../../../store/cartSlice";
import "./Product.css";

function ProductItem({ product, userRole }) {
  const dispatch = useDispatch();
  const cartQuantity = useSelector(selectItemQuantity(product.id));
  const [quantity, setQuantity] = useState(cartQuantity);

  // Sync local state with cart state
  useEffect(() => {
    setQuantity(cartQuantity);
  }, [cartQuantity]);

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    dispatch(updateQuantity({ productId: product.id, quantity: newQuantity }));
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(0, quantity - 1);
    dispatch(updateQuantity({ productId: product.id, quantity: newQuantity }));
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
        {quantity === 0 ? (
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
            <span className="qty-value">{quantity}</span>
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
