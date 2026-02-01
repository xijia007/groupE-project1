import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProductInCart } from "../../features/cart/slices/cartSlice";
import './EditProduct.css';
import ProductForm from '../../components/product/ProductForm/ProductForm';
import { useAuth } from "../../features/auth/contexts/AuthContext";


function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        // Prevent state update if component unmounted
        if (isMounted) {
          setProduct(data.data || null);
        }
      } catch (err) {
        if (isMounted) setProduct(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    // Cleanup function to set isMounted false
    return () => {
      isMounted = false;
    };
  }, [id]);


  const { user } = useAuth();
  
  // Security Check: Verify if the current user is the creator of the product
  // Checks both string IDs and ObjectIds depending on backend response format
  const isOwner = product && user && (product.createdBy === user.userId || product.createdBy === user._id || product.createdBy === user.id);

  if (loading) return <h1>Loading...</h1>;

  if (!product) {
    return <h1>Product not found</h1>
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteError("");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/products/${id}/delete`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        setDeleteError("Failed to delete product.");
        return;
      }

      navigate("/");
    } catch (err) {
      setDeleteError("Failed to delete product.");
    }
  };

  return (
    <div className="create-product">
      <h1>Edit Product</h1>
      {!isOwner && <div style={{color: 'orange', marginBottom: '10px'}}>You are viewing this product in read-only mode because you are not the creator.</div>}
      <ProductForm
        initialValues={product}
        submitLabel="Update Product"
        readOnly={!isOwner}
        onSubmit={async (data) => {
          // Double check ownership before allowing submission
          if (!isOwner) return; 
          try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`/api/products/${id}/edit`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(data),
            });

            if (!res.ok) return;

            // Optimistic Update: Update Redux store immediately 
            // This prevents needing a page reload to see price/name changes in the cart
            const productId = product?.id || id;
            
            dispatch(updateProductInCart({ 
              id: productId, 
              updates: data 
            }));

            // Navigate back to the product detail page to see the updated information
            navigate(`/products/${id}`);
          } catch (err) {
            // optional: error handling
          }
        }}
      />
      {isOwner && (
        <div className="edit-product-actions">
          <button type="button" className="delete-button" onClick={handleDelete}>
            Delete Product
          </button>
          {deleteError && <div className="delete-error">{deleteError}</div>}
        </div>
      )}
      {showDeleteConfirm && (
        <div className="edit-delete-overlay">
          <div className="edit-delete-modal">
            <div className="edit-delete-title">
              Are you sure to delete this product?
            </div>
            <div className="edit-delete-actions">
              <button
                type="button"
                className="delete-confirm"
                onClick={handleDeleteConfirm}
              >
                Yes
              </button>
              <button
                type="button"
                className="delete-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProduct;
