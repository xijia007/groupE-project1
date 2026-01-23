import { useNavigate } from "react-router-dom";
import ProductFrom from "../assets/components/Products/ProductForm";

function CreateProduct({onCreateProduct}) {
    const navigate = useNavigate();

    const handleSubmit = (data) => {
        onCreateProduct(data);
        navigate("/");
    };

    return (
        <div className="create-product">
            <h1>Create Product</h1>
            <ProductFrom 
                initialValues={null}
                submitLabel="Create Product"
                onSubmit={handleSubmit}
            />
        </div>
    )
}

export default CreateProduct;