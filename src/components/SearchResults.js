import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ currentUser }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query');

        if (query) {
            searchProducts(query);
        } else {
            fetchProducts();
        }
    }, [location.search]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3333/api/v1/products');
            if (response.data && response.data.data) {
                setProducts(response.data.data);
            } else {
                console.error('Invalid API response:', response);
                alert('Failed to fetch products. Please try again later.');
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            alert('Failed to fetch products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const searchProducts = async (query) => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3333/api/v1/products/search', {
                params: { query }
            });
            if (response.data && response.data.data) {
                setProducts(response.data.data);
            } else {
                console.error('Invalid API response:', response);
                alert('Failed to search products. Please try again later.');
            }
        } catch (error) {
            console.error('Failed to search products:', error);
            alert('Failed to search products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product) => {
        try {
            if (!currentUser) {
                navigate('/login');
                return;
            }

            const response = await axios.post('http://localhost:3333/api/v1/cart/add', {
                productId: product.id,
                userId: currentUser.id,
            });

            console.log('Product added to cart:', response.data);
            alert('Product added to cart successfully!');
        } catch (error) {
            console.error('Failed to add product to cart:', error);
            alert('Failed to add product to cart. Please try again later.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    const formatPrice = (price) => {
        return parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    return (
        <div className="product-list">
            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product.id} className="product-item">
                        <img src={`http://localhost:3333/images/${product.image}`} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${formatPrice(product.price)}VND</p>
                        {product.stock <= 0 ? (
                            <p className="out-of-stock">Out of Stock</p>
                        ) : (
                            <button onClick={() => addToCart(product)} disabled={product.stock <= 0}>
                                Add to cart
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );
};

export default ProductList;