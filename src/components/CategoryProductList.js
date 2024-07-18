import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from './CartContext';
import { toast } from 'react-toastify';
import './ProductList.css';

const CategoryProductList = ({ currentUser }) => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!id) {
                setError('Category ID is missing');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/categories/${id}/products`);
                if (response.data && response.data.data) {
                    setProducts(response.data.data);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setError(error.message || 'Failed to fetch products');
                toast.error('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [id]);

    const handleAddToCart = (product) => {
        if (!currentUser) {
            toast.warn('Please log in to add items to your cart.');
            navigate('/login');
            return;
        }
        addToCart(product);
        toast.success(`Added ${product.name} to cart!`);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!products || products.length === 0) {
        return <p>No products found for this category.</p>;
    }

    const formatPrice = (price) => {
        return parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    return (
        <div className="product-list-container">
            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <img
                            src={product.image ? `http://localhost:3333/images/${product.image}` : 'placeholder.jpg'}
                            alt={product.name || 'Product'}
                        />
                        <h3>{product.name || 'Unnamed Product'}</h3>
                        <p>{product.description || 'No description available'}</p>
                        <p className="price">Price: {product.price ? `${formatPrice(product.price)} VND` : 'Price not available'}</p>
                        {product.stock <= 0 ? (
                            <p className="out-of-stock">Out of Stock</p>
                        ) : (
                            <button className="add-to-cart" onClick={() => handleAddToCart(product)}>Add to cart</button>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={() => navigate('/cart')} className="view-cart-button">
                View Cart
            </button>
        </div>
    );
};

export default CategoryProductList;