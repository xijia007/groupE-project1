import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const token = localStorage.getItem("accessToken");

        if (!token) {
            if (isMounted) setUserInfo(null);
            return () => {
                isMounted = false;
            };
        }

        const fetchMe = async () => {
            try {
                const res = await fetch('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
                        <button className='add-button'>Add To Cart</button>
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
