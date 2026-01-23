import ProductItem from "./ProductItem";
import "./Product.css";

function ProductList({ products }) {
    return (
        <>
        <div className="product-list-grid">
            {products.map((item) => (
                <ProductItem key={item.id} product={item} />
            ))}
        </div>      
        </>
    )
}

export default ProductList;
