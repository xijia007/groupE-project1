import { Link, useParams } from "react-router-dom";
import products from '../assets/data/mock_products.json';
import './EditProduct.css';


function EditProduct() {
  const { id } = useParams(); // use useParams to get the id
  const product = products.find((p)=>String(p.id) === id); // find the product through id

  if (!product) {
    return <h1>Product not found</h1>
  }

  return (
    <div className="edit-product">

      <div className="edit-product-header">
        <h1>Edit Product Page</h1>
        <Link className="back-to-home" to='/'>
          <button>Back To Home Page</button>
        </Link>
      </div>
      <div className="edit-product-frame">
        <div className="edit-product-img"> 
          <label className="edit-img-label"> Product image: </label>
          <div className="edit-img-detail">
            <img src={product.img_url} alt={product.name} />
          </div>
        </div>
        <div className="edit-product-name">
          <label className="edit-name-label"> Product name: </label>
          <div className="edit-name-detail">{product.name}</div>
        </div>
        <div className="edit-product-price">
          <label className="edit-price-label"> Product price: </label>
          <div className="edit-price-detail">${product.price}</div>
        </div>
        <div className="edit-product-stock-status">
          <label className="edit-stock-label"> Product stock: </label>
          <div className="edit-stock-detail">
            Stock status
          </div>
        </div>
        <div className="edit-product-description">
          <label className="edit-description-label"> Product description: </label>
          <div className="edit-description-detail">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
