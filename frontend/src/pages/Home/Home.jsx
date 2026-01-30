import ProductList from "../../components/product/ProductList/ProductList";
import Pagination from "../../components/product/Pagination/Pagination.jsx";
import "./Home.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../features/products/slices/productsSlice";
import { useAuth } from "../../features/auth/contexts/AuthContext";

function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user: userInfo } = useAuth(); // 使用 Context 中的 user
  const dispatch = useDispatch();

  const [sortOrder, setSortOrder] = useState("last_added");

  const { allItems, searchItems, mode } = useSelector(
    (state) => state.products,
  );

  function isMoblie(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
    useEffect(() => {
      const onResize = () => setIsMobile(window.innerWidth < breakpoint);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [breakpoint]);
    return isMobile;
  }
  const isMobileView = isMoblie(768);
  const ItemsPerPage = isMobileView ? 3 : 10;
  const [filterByCreator, setFilterByCreator] = useState(() => {
    return sessionStorage.getItem('adminEditMode') === 'true';
  });

  useEffect(() => {
    sessionStorage.setItem('adminEditMode', filterByCreator);
  }, [filterByCreator]);

  // Prepare raw products
  const rawProducts = useMemo(() => {
    let items = mode === "search" ? searchItems : allItems;
    items = items || [];
    
    // Admin Edit Mode Filter
    if (filterByCreator && userInfo?.role === 'admin') {
      items = items.filter(item => {
         // handle various potential ID field names for compatibility
         const creatorId = item.createdBy; 
         // userId from context might be .userId, .id, or ._id depending on backend response standard
         const myId = userInfo.userId || userInfo.id || userInfo._id;
         return creatorId === myId;
      });
    }

    return items.map((item) => ({
      ...item,
      id: item.id || item._id,
    }));
  }, [mode, searchItems, allItems, filterByCreator, userInfo]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    // Create a shallow copy to avoid mutating original array
    const sorted = [...rawProducts];

    switch (sortOrder) {
      case "price_low_high":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_high_low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "last_added":
      default:
        // Assume _id desc or createdAt desc for 'last added'
        // If items contain createdAt, rely on that:
        // sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // Fallback: reverse the list if default is oldest first, or sort by _id descending
        // Let's assume sorting by _id (which contains timestamp) descending is safest for MongoDB
        sorted.sort((a, b) => {
          const idA = a.id || "";
          const idB = b.id || "";
          if (idA < idB) return 1;
          if (idA > idB) return -1;
          return 0;
        });
        break;
    }
    return sorted;
  }, [rawProducts, sortOrder]);

  const totalPage = Math.ceil(sortedProducts.length / ItemsPerPage);
  const startIndex = (currentPage - 1) * ItemsPerPage;
  const endIndex = startIndex + ItemsPerPage;
  const productsToDisplay = sortedProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllProducts())
      .unwrap()
      .catch(() => {
        // errors are handled by returning empty list in UI
      })
      .finally(() => setLoading(false));
  }, [dispatch, location.key]);
  useEffect(() => {
    setCurrentPage(1); // Reset to first page on sort order change
  }, [mode, searchItems, allItems, sortOrder, filterByCreator]);

  const handleCreateProduct = () => {
    navigate("/createProduct");
  };

  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div className="product-main">
      <div className="product-header">
        <label className="product-label">Products</label>

        <div className="product-header-controls">
          {userInfo?.role === "admin" && (
             <button
               className={`edit-mode-button ${filterByCreator ? 'active' : ''}`}
               onClick={() => setFilterByCreator(!filterByCreator)}
               title="Show only my created products"
               style={{ 
                  marginRight: '10px',
                  padding: '8px 16px',
                  backgroundColor: filterByCreator ? '#007bff' : '#f0f0f0',
                  color: filterByCreator ? 'white' : 'black',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
               }}
             >
               Edit Mode {filterByCreator ? '(On)' : '(Off)'}
             </button>
          )}

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
            <div className="user-info" style={{ display: "none" }}>
              {" "}
              {/* Optional: hide user info here if header already has it */}
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
        <ProductList products={productsToDisplay} userRole={userInfo?.role} />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

export default Home;
