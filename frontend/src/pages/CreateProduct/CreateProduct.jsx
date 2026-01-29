import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/product/ProductForm/ProductForm";

function CreateProduct() {
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

    useEffect(() => {
        let isMounted = true;
        const token = localStorage.getItem("accessToken");

        if (!token) {
            navigate("/signin", { replace: true });
            return;
        }

        const fetchMe = async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                const role = data?.user?.role;
                if (isMounted) {
                    setIsAdmin(role === "admin");
                    setAuthLoading(false);
                }
                if (role !== "admin") {
                    navigate("/", { replace: true });
                }
            } catch (err) {
                if (isMounted) setAuthLoading(false);
                navigate("/signin", { replace: true });
            }
        };

        fetchMe();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    if (authLoading) {
        return <div>Loading...</div>;
    }

    if (!isAdmin) {
        return null;
    }

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
