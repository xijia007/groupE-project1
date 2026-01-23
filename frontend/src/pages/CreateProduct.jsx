import { useNavigate } from "react-router-dom";
import ProductForm from "../assets/components/Products/ProductForm";

function CreateProduct() {
    console.log("CreateProduct rendered");
    const navigate = useNavigate();

    // const handleSubmit = (data) => {
    //     onCreateProduct(data);
    //     navigate("/");
    // };
    const handleSubmit = async (data) => {
        try {
            const token = localStorage.getItem("accessToken");
            console.log("handleSubmit start");
            console.log("token:", token);
            console.log("payload:", data);
            console.log("about to fetch");
            const res = await fetch("/api/products/add", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}`} : {}),

                },
                body: JSON.stringify(data),
                
            });
            console.log("token:", token);
            console.log("payload:", data);
            const result = await res.json();
            console.log("create response:", res.status, result);
            if (!res.ok) {
                return;
            }
            navigate('/');
        } catch (err) {
            return;
        }
        console.log("payload", data);
    };

    return (
        <div className="create-product">
            <h1>Create Product</h1>
            <ProductForm 
                initialValues={null}
                submitLabel="Create Product"
                onSubmit={handleSubmit}
            />
        </div>
    )
}

export default CreateProduct;
