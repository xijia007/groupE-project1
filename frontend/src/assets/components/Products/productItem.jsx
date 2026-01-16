import { useState } from "react";
import { Link } from "react-router-dom";
import "./Product.css";

function ProductItem({ product }) {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => {
    setQuantity(1);
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-card-image">
          <img src={product.imageURL} alt={product.name} />
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
        <Link to={`/products/${product.id}/edit`}>
          <button className="product-card-edit" type="button">
            Edit
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ProductItem;
