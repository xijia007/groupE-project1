import { useEffect, useState } from "react";
import "./ProductForm.css";

// Define initial empty state for the product fields
const defaultValues = {
    name: "",
    price: "",
    description: "",
    img_url: "",
    stock: "",
    category: "",
    customCategory: ""
};

const PREDEFINED_CATEGORIES = [
    "Category1",
    "Category2",
    "Category3",
    "Category4",
    "Category5",
    "Category6",
];

function ProductForm({ initialValues, onSubmit, submitLabel, categories, readOnly = false }) {
    // Determine which categories to query
    const categoryOptions = PREDEFINED_CATEGORIES;

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
            const customCategory = formData.customCategory.trim();
            const cleanedData = {
                ...formData,
                category: customCategory || formData.category,
                stock: formData.stock === "" ? undefined : Number(formData.stock),
                price: formData.price === "" ? undefined : Number(formData.price),
            };
            delete cleanedData.customCategory;
            // Execute the parent-provided submission logic if valid
            onSubmit(cleanedData);
        }
    };

    return (
        <div className="product-form-container">
            <form
                onSubmit={handleSubmit}
                className="product-form"
            >
                {/* 1. Product Name */}
                <div className="form-group">
                    <label>Product name</label>
                    <input 
                        className={errors.name ? "error" : ""}
                        value={formData.name}
                        onChange={handleChange("name")}
                        placeholder="iWatch"
                        disabled={readOnly}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                {/* 2. Product Description */}
                <div className="form-group">
                    <label>Product Description</label>
                    <textarea 
                        value={formData.description}
                        onChange={handleChange("description")}
                        rows="4"
                        disabled={readOnly}
                    />
                </div>

                {/* 3. Category + Price (side by side) */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            className="category-select"
                            value={formData.category}
                            onChange={handleChange("category")}
                            disabled={readOnly}
                        >
                            <option value="">Select category</option>
                            {categoryOptions.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input 
                            className={`price-input ${errors.price ? "error" : ""}`}
                            type="text"
                            value={formData.price}
                            onChange={handleChange("price")}
                            placeholder="50"
                            disabled={readOnly}
                        />
                        {errors.price && <span className="error-message">{errors.price}</span>}
                    </div>
                </div>

                {/* 4. Stock + Image Link (side by side) */}
                <div className="form-row">
                    <div className="form-group">
                        <label>In Stock Quantity</label>
                        <input
                            className={errors.stock ? "error" : ""}
                            type="number"
                            value={formData.stock}
                            onChange={handleChange("stock")}
                            placeholder="100"
                            disabled={readOnly}
                        />
                        {errors.stock && <span className="error-message">{errors.stock}</span>}
                    </div>
                    <div className="form-group">
                        <label>Add Image Link</label>
                        <div className="image-url-input">
                            <input 
                                className={errors.img_url ? "error" : ""}
                                value={formData.img_url}
                                onChange={handleChange("img_url")}
                                placeholder="http://"
                                disabled={readOnly}
                            />
                            {!readOnly && <button type="button" className="upload-button">Upload</button>}
                        </div>
                        {errors.img_url && <span className="error-message">{errors.img_url}</span>}
                    </div>
                </div>

                {/* 5. Image Preview */}
                <div className="image-preview-section">
                    <div className={`image-preview ${formData.img_url ? 'has-image' : ''}`}>
                        {formData.img_url ? (
                            <img src={formData.img_url} alt="Product preview" />
                        ) : (
                            <div className="preview-placeholder">
                                <div className="placeholder-icon"></div>
                                <p>image preview!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 6. Submit Button - Only show if not readOnly */}
                {!readOnly && <button type="submit" className="submit-button">{submitLabel}</button>}
            </form>
        </div>
    )
};

export default ProductForm;
