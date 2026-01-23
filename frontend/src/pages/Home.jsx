import ProductList from "../assets/components/Products/productList";
import products from "../assets/data/mock_products.json";
import './Home.css';
import { useNavigate } from "react-router-dom"

function Home() {
    const navigate = useNavigate();
    const handleCreateProduct = () => {
        navigate('/createProduct');
    }

    return (
        <div className="product-main">
            <div className="product-header">
                <label className="product-label">Products</label>
                <div className="add-product">
                    <button 
                        className="add-button" 
                        onClick={handleCreateProduct}
                    >
                        Add Product
                    </button>
                </div>
            </div>
            <div className="product-list">
                <ProductList products={products} />
            </div>
      
            


        </div>
    )
}

export default Home;