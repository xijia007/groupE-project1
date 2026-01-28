import ProductItem from "../ProductItem/ProductItem";
import "./ProductList.css"; /* Import own layout styles */
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
