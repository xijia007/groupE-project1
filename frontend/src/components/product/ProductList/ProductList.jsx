import ProductItem from "../ProductItem/ProductItem";
import "../ProductItem/ProductItem.css";
import { useSelector } from "react-redux";

function ProductList({ products, userRole }) {
  return (
    <>
      <div className="product-list-grid">
        {products.map((item) => (
          <ProductItem key={item.id} product={item} userRole={userRole} />
        ))}
      </div>
    </>
  );
}

export default ProductList;
