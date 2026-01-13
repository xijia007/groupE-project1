import "./Product.css";

function ProductItem({ product }) {
    return (
        <>
        <div className="product-card">
            <div className="product-card-image">
                <img src={product.imageURL} alt={product.name} />
            </div>
            <div className="product-card-body">
                <div className="product-card-name">{product.name}</div>
                <div className="product-card-price">${product.price}</div>
            </div>
        </div>                 
        </>
    )
}

export default ProductItem;
