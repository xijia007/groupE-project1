import { Link, useParams } from "react-router-dom";
import products from '../assets/data/mock_products.json';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const product = products.find((p) => String(p.id) === id);

    if (!product) {
        return <h1>Product not found</h1>;
    }

    return (
        <div className="product-detail">
            <div className="product-detail-header">
                <h1>Products Detail</h1>
                <Link className="back-to-home" to='/'>
                    <button>Back To Home Page</button>
                </Link>
            </div>
            
            <div className="product-frame">
                <div className="product-img-frame" >
                    <img className="product-img" src={product.img_url} alt={product.name} />
                </div>
               
                <div className="product-body">
                    <div className="product-name">{product.name}</div>
                    <div className="product-price-stock">
                        <div className="product-price">${product.price}</div>
                        <div className="stock-status">Stock status</div>
                    </div>
                    <div className="product-description">{product.description}</div>
            
                    <div className="product-button">
                        <button className='add-button'>Add To Cart</button>
                        <button className="edit-button">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail;