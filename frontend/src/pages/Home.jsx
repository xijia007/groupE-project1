import ProductList from "../assets/components/Products/ProductList";
import './Home.css';
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState(null);

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

        const fetchProducts = async () => {
            try {
            const res = await fetch('/api/products', { cache: "no-store" });
                const data = await res.json()
                console.log("products response", data);

                if (isMounted) {
                    const normalized = (data.data || []).map((item) => ({
                        ...item,
                        id: item.id || item._id,
                    }));
                    setProducts(normalized);
                }
            } catch (err) {
                if (isMounted) {
                    setProducts([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchProducts();
        
        return () => {
            isMounted = false;
        };
    }, [location.key]);

    const handleCreateProduct = () => {
        navigate('/createProduct');
        console.log("Add Product clicked");
    }

    if (loading) {
        return <div>Loading</div>;
    };

    return (
        <div className="product-main">

            <div className="product-header">
                <label className="product-label">Products</label>
                {userInfo && (
                    <div className="user-info">
                        Welcome,  {userInfo.email} ({userInfo.role})
                    </div>
                )}
                {userInfo?.role === "admin" && (
                    <div className="add-product">
                        <button 
                            className="add-button" 
                            onClick={handleCreateProduct}
                        >
                            Add Product
                        </button>
                    </div>
                )}
                
            </div>
            <div className="product-list">
                <ProductList products={products} userRole={userInfo?.role} />
            </div>
      
            


        </div>
    )
}

export default Home;
