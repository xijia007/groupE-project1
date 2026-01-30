import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/product/ProductForm/ProductForm";
import { useAuth } from "../../features/auth/contexts/AuthContext";

function CreateProduct() {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();

    const handleSubmit = async (data) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch("/api/products/add", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}`} : {}),
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) {
                return;
            }
            navigate('/');
        } catch (err) {
            return;
        }
    };



    return (
        <div className="create-product">
            <h1>Create Product</h1>
            <ProductForm 
                initialValues={null}
                submitLabel="Add Product"
                onSubmit={handleSubmit}
            />
        </div>
    )
}

export default CreateProduct;
