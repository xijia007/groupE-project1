import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  updateQuantity,
  removeFromCart,
} from "../../features/cart/slices/cartSlice";
import { useToast } from "../../features/toast/contexts/ToastContext";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const { showToast } = useToast();

  // Promotion code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  const handleClose = () => {
    console.log("cart closing");
    navigate(-1);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleIncrement = (productId, currentQuantity, stock) => {
    if (stock !== undefined && currentQuantity >= stock) {
      showToast(`Cannot add more than ${stock} items`, "warning");
      return;
    }
    dispatch(updateQuantity({ productId, quantity: currentQuantity + 1 }));
  };

  const handleDecrement = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ productId, quantity: currentQuantity - 1 }));
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleApplyPromo = async () => {
    try {
      const response = await fetch(`/api/coupons/verify?code=${promoCode}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify coupon");
      }
      const data = await response.json();
      setAppliedPromo({
        code: promoCode,
        type: "percentage",
        value: data.discountPercentage,
        description: `${data.discountPercentage}% off`,
      });
      setPromoError("");
      showToast(`Promo code ${promoCode} applied!`, "success");
    } catch (error) {
      setPromoError(error.message);
      showToast(error.message, "error");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  // Calculate prices
  const subtotal = totalPrice;
  const tax = subtotal * 0.1; // 10% tax

  // Calculate discount
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "percentage") {
      discount = subtotal * (appliedPromo.value / 100);
    } else if (appliedPromo.type === "fixed") {
      discount = appliedPromo.value;
    }
  }

  const estimatedTotal = subtotal + tax - discount;

  return (
    <div className="cart-overlay" onClick={handleClose}>
      <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h1>Cart ({totalItems})</h1>
          <button onClick={handleClose}>X</button>
        </div>
        <div className="cart-body">
          <div className="cart-items-list">
            {cartItems.length === 0 ? (
              <div className="empty-cart">Your cart is empty</div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.img_url}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-top-row">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="cart-item-bottom-row">
                      <div className="cart-item-controls">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleDecrement(item.id, item.quantity)
                          }
                        >
                          -
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleIncrement(item.id, item.quantity, item.stock)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="cart-bottom">
          <div className="discount-part">
            <div className="discount-label">Apply Discount Code</div>
            <div className="discount-body">
              <input
                className={`discount-input ${promoError ? "error" : ""}`}
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleApplyPromo()}
                disabled={appliedPromo !== null}
              />
              {appliedPromo ? (
                <button
                  className="remove-promo-button"
                  onClick={handleRemovePromo}
                >
                  Remove
                </button>
              ) : (
                <button className="apply-button" onClick={handleApplyPromo}>
                  Apply
                </button>
              )}
            </div>
            {promoError && <div className="promo-error">{promoError}</div>}
            {appliedPromo && (
              <div className="promo-success">
                ✓ {appliedPromo.code} applied ({appliedPromo.description})
              </div>
            )}
            <div
              className="discount-total-preview"
              style={{
                marginTop: "10px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Estimated Total: ${estimatedTotal.toFixed(2)}
            </div>
          </div>
          <div className="numbers">
            <div className="numbers-between">
              <div>Subtotal</div>
              <div>${subtotal.toFixed(2)}</div>
            </div>
            <div className="numbers-between">
              <div>Tax</div>
              <div>${tax.toFixed(2)}</div>
            </div>
            <div className="numbers-between">
              <div>Discount</div>
              <div>${discount.toFixed(2)}</div>
            </div>
            <div className="numbers-between">
              <div>Estimated total</div>
              <div>${estimatedTotal.toFixed(2)}</div>
            </div>
          </div>
          <button
            className="continue-button"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Continue to checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
