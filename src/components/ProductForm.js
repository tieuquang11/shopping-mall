import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductForm.css';

const ProductForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [image, setImage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form
        const errors = {};
        if (!name.trim()) {
            errors.name = 'Name is required';
        }
        if (!description.trim()) {
            errors.description = 'Description is required';
        }
        if (!price) {
            errors.price = 'Price is required';
        }
        if (!stock) {
            errors.stock = 'Stock is required';
        }
        if (!categoryId) {
            errors.categoryId = 'Category is required';
        }
        if (!image) {
            errors.image = 'Image is required';
        }
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('category_id', categoryId);
        formData.append('image', image);

        try {
            await axios.post('http://localhost:3333/api/v1/products', formData);
            alert('Product created successfully!');
            navigate('/');
        } catch (error) {
            console.error('Failed to create product:', error);
            alert('Failed to create product.');
        }
    };

    return (
        <div className="product-form">
            <h2>Create New Product</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    {formErrors.name && <div className="error-message">{formErrors.name}</div>}
                </label>
                <label>
                    Description:
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                    {formErrors.description && <div className="error-message">{formErrors.description}</div>}
                </label>
                <label>
                    Price:
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    {formErrors.price && <div className="error-message">{formErrors.price}</div>}
                </label>
                <label>
                    Stock:
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                    {formErrors.stock && <div className="error-message">{formErrors.stock}</div>}
                </label>
                <label>
                    Category:
                    <input type="text" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
                    {formErrors.categoryId && <div className="error-message">{formErrors.categoryId}</div>}
                </label>
                <label>
                    Image:
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    {formErrors.image && <div className="error-message">{formErrors.image}</div>}
                </label>
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
};

export default ProductForm;
