import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './EditProduct.css';
import ProductForm from '../assets/components/Products/ProductForm';


function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
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
        navigate("/");
      } catch (err) {
        // 可选：错误处理
      }
    }}
  />
  );
}

export default EditProduct;
