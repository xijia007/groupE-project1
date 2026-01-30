import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProductInCart } from "../../features/cart/slices/cartSlice";
import './EditProduct.css';
import ProductForm from '../../components/product/ProductForm/ProductForm';


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
    return () => {
      isMounted = false;
    };
  }, [id]);


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
      <ProductForm
        initialValues={product}
        submitLabel="Update Product"
        onSubmit={async (data) => {
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

            // Update local cart state immediately so user sees changes without refresh
            // Ensure ID type matches what's in the store (handling potential string/number mismatch)
            // We use the ID from the URL but try to cast if existing product has number ID.
            // A safer bet is to use the ID from the fetched product state if available.
            const productId = product?.id || id;
            
            dispatch(updateProductInCart({ 
              id: productId, 
              updates: data 
            }));

            navigate("/");
          } catch (err) {
            // optional: error handling
          }
        }}
      />
      <div className="edit-product-actions">
        <button type="button" className="delete-button" onClick={handleDelete}>
          Delete Product
        </button>
        {deleteError && <div className="delete-error">{deleteError}</div>}
      </div>
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
