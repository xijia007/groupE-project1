import ProductList from "../../components/product/ProductList/ProductList";
import "./Home.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../features/products/slices/productsSlice";
import { useAuth } from "../../features/auth/contexts/AuthContext";

function Home() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user: userInfo } = useAuth(); // 使用 Context 中的 user
  const dispatch = useDispatch();

  const { allItems, searchItems, mode } = useSelector(
    (state) => state.products,
  );
  const rawProducts = mode === "search" ? searchItems : allItems;
  const products = (rawProducts || []).map((item) => ({
    ...item,
    id: item.id || item._id,
  }));

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllProducts())
      .unwrap()
      .catch(() => {
        // errors are handled by returning empty list in UI
      })
      .finally(() => setLoading(false));
  }, [dispatch, location.key]);

  const handleCreateProduct = () => {
    navigate("/createProduct");
    console.log("Add Product clicked");
  };

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className="product-main">
      <div className="product-header">
        <label className="product-label">Products</label>
        {userInfo && (
          <div className="user-info">
            Welcome, {userInfo.name} ({userInfo.role})
          </div>
        )}
        {userInfo?.role === "admin" && (
          <div className="add-product">
            <button className="add-button" onClick={handleCreateProduct}>
              Add Product
            </button>
          </div>
        )}
      </div>
      <div className="product-list">
        <ProductList products={products} userRole={userInfo?.role} />
      </div>
    </div>
  );
}

export default Home;