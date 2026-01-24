import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { 
    selectCartItems, 
    selectCartTotalItems, 
    selectCartTotalPrice,
    updateQuantity,
    removeFromCart 
} from "../store/cartSlice";
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const totalItems = useSelector(selectCartTotalItems);
    const totalPrice = useSelector(selectCartTotalPrice);
    
    const handleClose = () => {
        console.log("cart closing");
        navigate(-1);
    }

    const handleCheckout = () => {
        navigate('/checkout');
    }

    const handleIncrement = (productId, currentQuantity) => {
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

    const subtotal = totalPrice;
    const tax = subtotal * 0.1; // 10% tax
    const discount = 0; // Can be implemented later
    const estimatedTotal = subtotal + tax - discount;

    return (
        <div className="cart-overlay" onClick={handleClose}>
            <div    
                className="cart-popup" 
                onClick={(e)=>e.stopPropagation()}
            >
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
                                    <img src={item.img_url} alt={item.name} className="cart-item-image" />
                                    <div className="cart-item-details">
                                        <div className="cart-item-name">{item.name}</div>
                                        <div className="cart-item-price">${item.price}</div>
                                    </div>
                                    <div className="cart-item-controls">
                                        <button 
                                            className="qty-btn" 
                                            onClick={() => handleDecrement(item.id, item.quantity)}
                                        >
                                            -
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button 
                                            className="qty-btn" 
                                            onClick={() => handleIncrement(item.id, item.quantity)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="cart-item-total">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button 
                                        className="remove-btn"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="discount-part">
                        <div className="discount-label">Apply Discount Code</div>
                        <div className="discount-body">
                            <input
                                className="discount-input"
                                placeholder="20 DOLLAR OFF"
                            />
                            <button className='apply-button'>Apply</button>
                        </div>
                    </div>
                </div>
                <div className="cart-bottom">
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
    )
}

export default Cart;
