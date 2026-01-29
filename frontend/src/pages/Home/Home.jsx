import ProductList from "../../components/product/ProductList/ProductList";
import "./Home.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../features/products/slices/productsSlice";
import { useAuth } from "../../features/auth/contexts/AuthContext";

function Home() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user: userInfo } = useAuth(); // 使用 Context 中的 user
  const dispatch = useDispatch();

  const [sortOrder, setSortOrder] = useState('last_added');

  const { allItems, searchItems, mode } = useSelector(
    (state) => state.products,
  );
  
  // Prepare raw products
  const rawProducts = useMemo(() => {
    const items = mode === "search" ? searchItems : allItems;
    return (items || []).map((item) => ({
      ...item,
      id: item.id || item._id,
    }));
  }, [mode, searchItems, allItems]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    // Create a shallow copy to avoid mutating original array
    const sorted = [...rawProducts];
    
    switch (sortOrder) {
      case 'price_low_high':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_high_low':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'last_added':
      default:
        // Assume _id desc or createdAt desc for 'last added'
        // If items contain createdAt, rely on that:
        // sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // Fallback: reverse the list if default is oldest first, or sort by _id descending
        // Let's assume sorting by _id (which contains timestamp) descending is safest for MongoDB
        sorted.sort((a, b) => {
           const idA = a.id || '';
           const idB = b.id || '';
           if (idA < idB) return 1;
           if (idA > idB) return -1;
           return 0;
        });
        break;
    }
    return sorted;
  }, [rawProducts, sortOrder]);


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
        
        <div className="product-header-controls">
            <select 
              className="sort-dropdown"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="last_added">Last added</option>
              <option value="price_low_high">Price: low to high</option>
              <option value="price_high_low">Price: high to low</option>
            </select>

            {userInfo && (
             <div className="user-info" style={{ display: 'none' }}> {/* Optional: hide user info here if header already has it */}
              Welcome, {userInfo.name} ({userInfo.role})
             </div>
            )}
            
            {userInfo?.role === "admin" && (
                <button className="add-button" onClick={handleCreateProduct}>
                  Add Product
                </button>
            )}
        </div>
      </div>
      <div className="product-list">
        <ProductList products={sortedProducts} userRole={userInfo?.role} />
      </div>
    </div>
  );
}

export default Home;