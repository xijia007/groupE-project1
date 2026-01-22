import { Link, useNavigate } from "react-router-dom"
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();
    const handleClose = () => {
        console.log("cart closing");
        navigate(-1);
    }
    console.log("render cart")

    return (
        <div className="cart-overlay" onClick={handleClose}>
        <div    
            className="cart-popup" 
            onClick={(e)=>e.stopPropagation()}
            // style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
        >

        <div className="cart-header">
            <h1>Cart(count)</h1>
            <button onClick={handleClose}>X</button>
        </div>
        </div>
        </div>
    )
}

export default Cart;
