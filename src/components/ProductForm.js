import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import './ProductForm.css';

const ProductForm = ({ userMode = false }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [image, setImage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/${userMode ? 'user/' : ''}products/${id}`);
            const product = response.data;
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setStock(product.stock);
            setCategoryId(product.category_id);
        } catch (error) {
            console.error('Failed to fetch product:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = {};
        if (!name.trim()) errors.name = 'Name is required';
        if (!description.trim()) errors.description = 'Description is required';
        if (!price) errors.price = 'Price is required';
        if (!stock) errors.stock = 'Stock is required';
        if (!categoryId) errors.categoryId = 'Category is required';
        if (!id && !image) errors.image = 'Image is required for new products';

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('category_id', categoryId);
        if (image) formData.append('image', image);

        try {
            if (id) {
                await api.put(`/${userMode ? 'user/' : ''}products/${id}`, formData);
                toast.success('Product updated successfully!');
            } else {
                await api.post(`/${userMode ? 'user/' : ''}products`, formData);
                toast.success('Product created successfully!');
            }
            navigate(userMode ? '/user/products' : '/');
        } catch (error) {
            console.error('Failed to save product:', error);
            toast.error('Failed to save product');
        }
    };

    return (
        <div className="product-form">
            <h2>{id ? 'Edit Product' : 'Create New Product'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {formErrors.name && <span className="error">{formErrors.name}</span>}
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    {formErrors.description && <span className="error">{formErrors.description}</span>}
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    {formErrors.price && <span className="error">{formErrors.price}</span>}
                </div>
                <div>
                    <label htmlFor="stock">Stock:</label>
                    <input
                        type="number"
                        id="stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                    {formErrors.stock && <span className="error">{formErrors.stock}</span>}
                </div>
                <div>
                    <label htmlFor="categoryId">Category ID:</label>
                    <input
                        type="number"
                        id="categoryId"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    />
                    {formErrors.categoryId && <span className="error">{formErrors.categoryId}</span>}
                </div>
                <div>
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    {formErrors.image && <span className="error">{formErrors.image}</span>}
                </div>
                <button type="submit">{id ? 'Update Product' : 'Create Product'}</button>
            </form>
        </div>
    );
};

export default ProductForm;