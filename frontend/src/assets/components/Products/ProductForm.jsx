import { useEffect, useState } from "react";

// Define initial empty state for the product fields
const defaultValues = {
    name: "",
    price: "",
    description: "",
    img_url: "",
    stock: "",
    category: ""
};

function ProductForm( { initialValues, onSubmit, submitLabel }) {
    // State to manage form input values
    const [formData, setFormData] = useState(defaultValues);
    // State to store validation error messages
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialValues) {
            // Only update if initialValues exists and is different from current default
            if (initialValues && Object.keys(initialValues).length > 0) {
                // Merge initial data with default structure to ensure all fields exist
                setFormData({ ...defaultValues, ...initialValues });
            }
        }
    }, [initialValues]);

    // Validation logic to ensure data quality before submission
    const validate = () => {
        const newErrors = {};

        // Image URL is mandatory for product display
        if (!formData.img_url.trim()) {
            newErrors.img_url = 'Image URL is required';
        }

        // Check if product name is provided and not just whitespace        
        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        // Price validation: must exist, be a number, and be greater than zero
        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
            newErrors.price = 'Please enter a valid price. number should more than 0.';
        }

        // Stock validation: must be a whole number (integer) if provided
        if (formData.stock && (isNaN(formData.stock) || !Number.isInteger(Number(formData.stock)))) {
            newErrors.stock = 'Stock must be an integer.';
        }

        // Update the error state 
        setErrors(newErrors);
        // return true only if no errors were found
        return Object.keys(newErrors).length === 0;
    };
    
    // handle input changes dynamically for any field
    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        // clear the specific error message as the user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null}));
        }
    };

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page refresh
        if (validate()) {
            // Normalize optional numeric fields for API validation.
            const cleanedData = {
                ...formData,
                stock: formData.stock === "" ? undefined : Number(formData.stock),
                price: formData.price === "" ? undefined : Number(formData.price),
            };
            // Execute the parent-provided submission logic if valid
            onSubmit(cleanedData);
        }
        console.log("form submit", formData);
        
    };

    return (
        <div className="form-container">
            <form
                onSubmit={handleSubmit}
                className="responsive-form"
            >
                {/* Name Input Group */}
                <div className="form-group">
                    <label>Product Name</label>
                    <input 
                        className={errors.name ? "error-input" : ""}
                        value={formData.name}
                        onChange={handleChange("name")}
                    />
                    {/* Conditional rendering of error message */}
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Price</label>
                        <input 
                            className={errors.price ? "error-input" : ""}
                            type="text"
                            value={formData.price}
                            onChange={handleChange("price")}
                        />
                        {errors.price && <span className="error-text">{errors.price}</span>}
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <input 
                            value={formData.category}
                            onChange={handleChange("category")}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Image URL</label>
                    <input 
                        className={errors.img_url ? "error-input" : ""}
                        value={formData.img_url}
                        onChange={handleChange("img_url")}
                    />
                    {errors.img_url && <span className="error-text">{errors.img_url}</span>}
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <input 
                        value={formData.description}
                        onChange={handleChange("description")}
                        row='4'
                    />
                </div>

                <button type="submit" className="submit-button">{submitLabel}</button>
            </form>
        </div>
    )
};

export default ProductForm;
