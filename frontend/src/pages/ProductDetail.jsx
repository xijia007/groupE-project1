import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity, selectItemQuantity } from "../store/cartSlice";
import { useToast } from "../contexts/ToastContext";
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("accessToken");
    const dispatch = useDispatch();
    const cartQuantity = useSelector(selectItemQuantity(id));
    const { showToast } = useToast();

    useEffect(() => {
        let isMounted = true;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                if (isMounted) {
                    setProduct(data.data || null);
                }
            } catch (err) {
                if (isMounted) {
                    setProduct(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProduct();
        return () => {
            isMounted = false;
        };
    }, [id]);

    useEffect(() => {
        let isMounted = true;
        const authToken = localStorage.getItem("accessToken");

        if (!authToken) {
            if (isMounted) setUserInfo(null);
            return () => {
                isMounted = false;
            };
        }

        const fetchMe = async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const data = await res.json();
                if (isMounted) {
                    setUserInfo(data.user || null);
                }
            } catch (err) {
                if (isMounted) setUserInfo(null);
            }
        };

        fetchMe();
        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            const stock = Number(product.stock ?? 0);
            if (stock <= 0) {
                showToast("Out of stock!", "error");
                return;
            }
            dispatch(addToCart({ product, quantity: 1 }));
            showToast("Added to cart", "success");
        }
    };

    const handleIncrement = () => {
        if (product) {
            const stock = Number(product.stock ?? 0);
            if (cartQuantity >= stock) {
                showToast(`Cannot add more than ${stock} items`, "warning");
                return;
            }
            dispatch(updateQuantity({ 
                productId: product._id || product.id, 
                quantity: cartQuantity + 1 
            }));
        }
    };

    const handleDecrement = () => {
        if (product && cartQuantity > 0) {
            dispatch(updateQuantity({ 
                productId: product._id || product.id, 
                quantity: cartQuantity - 1 
            }));
        }
    };

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (!product) {
        return <h1>Product not found</h1>;
    }

    const stockValue = Number(product.stock ?? 0);
    const isAdmin = userInfo?.role === "admin";
    let stockText = "";
    if (isAdmin) {
        stockText = stockValue > 0 ? `Stock: ${stockValue}` : "Stock: Out of Stock";
    } else {
        if (stockValue <= 0) stockText = "Stock: Out of Stock";
        else if (stockValue < 10) stockText = "Low Stock";
    }


    return (
        <div className="product-detail">
            <div className="product-detail-header">
                <h1>Products Detail</h1>
                <Link className="back-to-home" to='/'>
                    <button>Back To Home Page</button>
                </Link>
            </div>
            
            <div className="product-frame">
                <div className="product-img-frame" >
                    <img className="product-img" src={product.img_url} alt={product.name} />
                </div>
               
                <div className="product-body">
                    {product.category && (
                        <div className="product-category">{product.category}</div>
                    )}
                    <div className="product-name">{product.name}</div>
                    <div className="product-price-stock">
                        <div className="product-price">${product.price}</div>
                        {stockText && <div className="stock-status">{stockText}</div>}
                    </div>
                    <div className="product-description">{product.description}</div>
            
                    <div className="product-button">
                        {cartQuantity === 0 ? (
                            <button className='add-button' onClick={handleAddToCart}>
                                Add To Cart
                            </button>
                        ) : (
                            <div className="product-qty-controls">
                                <button className="qty-btn" onClick={handleDecrement}>-</button>
                                <span className="qty-value">{cartQuantity}</span>
                                <button className="qty-btn" onClick={handleIncrement}>+</button>
                            </div>
                        )}
                        {userInfo?.role === 'admin' && (
                            <Link to={`/products/${product._id || product.id}/edit`}>
                                <button className="edit-button">Edit</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail;
