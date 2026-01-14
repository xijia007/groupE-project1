import "./Product.css";
import { Link } from 'react-router-dom';

function ProductItem({ product }) {
    return (
        <>
         <Link to='/products/${product.id}' className="product-card">
            <div className="product-card-image">
                <img src={product.imageURL} alt={product.name} />
            </div>
            <div className="product-card-body">
                <div className="product-card-name">{product.name}</div>
                <div className="product-card-price">${product.price}</div>
            </div> 
        </Link>             
        </>
    )
}

export default ProductItem;
