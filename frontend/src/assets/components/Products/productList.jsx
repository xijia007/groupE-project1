import ProductItem from "./ProductItem";
import "./Product.css";

function ProductList({ products, userRole }) {
    return (
        <>
        <div className="product-list-grid">
            {products.map((item) => (
                <ProductItem key={item.id} product={item} userRole={userRole} />
            ))}
        </div>      
        </>
    )
}

export default ProductList;
