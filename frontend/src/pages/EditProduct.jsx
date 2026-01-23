import { Link, useParams } from "react-router-dom";
import products from '../assets/data/mock_products.json';
import './EditProduct.css';
import ProductForm from '../assets/components/Products/ProductForm';


function EditProduct( { products, onUpdateProduct }) {
  const { id } = useParams(); // use useParams to get the id
  const product = products.find((p)=>String(p.id) === id); // find the product through id

  if (!product) {
    return <h1>Product not found</h1>
  }

  return (
      <ProductForm 
        initialValues={product}
        submitLabel='Update Product'
        onSubmit={(data) => onUpdateProduct({...product, ...data})}
      />
  );
}

export default EditProduct;
