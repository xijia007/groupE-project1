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
                    <div>
                        Shopping Cart Products List
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
                            <div>$number</div>    
                        </div>
                        <div className="numbers-between">
                            <div>Tax</div>
                            <div>$number</div>

                        </div>
                        <div className="numbers-between">
                             <div>Discount</div>
                             <div>$number</div>

                        </div>
                        <div className="numbers-between">
                            <div>Estimated total</div>
                            <div>$number</div>

                        </div>
                    </div>
                    <button className="continue-button" onClick={handleCheckout}>
                       Continue to checkout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart;
