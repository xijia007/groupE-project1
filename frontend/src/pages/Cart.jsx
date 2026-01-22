import { Link, useNavigate } from "react-router-dom"
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();
    const handleClose = () => {
        console.log("cart closing");
        navigate(-1);
    }

    const handleCheckout = () => {
        navigate('/checkout');
    }

    return (
        <div className="cart-overlay" onClick={handleClose}>
            <div    
                className="cart-popup" 
                onClick={(e)=>e.stopPropagation()}
            >
                <div className="cart-header">
                    <h1>Cart (count)</h1>
                    <button onClick={handleClose}>X</button>
                </div>
                <div className="cart-body">
                    Cart body
                </div>
                <div className="cart-bottom">
                    <button className="continue-button" onClick={handleCheckout}>
                       Continue to checkout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart;
