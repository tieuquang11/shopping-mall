import React, { useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import { toast } from 'react-toastify';
import './ProductList.css';

const ProductList = ({ currentUser }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const fetchProducts = useCallback(async (page, limit) => {
        try {
            setLoading(true);
            const response = await api.get('/products', {
                params: { page, limit }
            });
            console.log('API Response:', response.data);

            const { data, meta } = response.data;

            setProducts(data);
            setCurrentPage(meta.currentPage);
            setTotalPages(meta.lastPage);
            setItemsPerPage(meta.perPage);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Failed to fetch products. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);



    useEffect(() => {
        fetchProducts(currentPage, itemsPerPage);
    }, [fetchProducts, currentPage, itemsPerPage]);

    useEffect(() => {
        if (products.length === 0 && currentPage > 1) {
            toast.info('No more products to display');
        }
    }, [products, currentPage]);

    const handleAddToCart = (product) => {
        if (!currentUser) {
            toast.warn('Please log in to add items to your cart.');
            navigate('/login');
            return;
        }
        addToCart(product);
        toast.success(`Added ${product.name} to cart!`);
    };

    const handlePageChange = (newPage) => {
        console.log('Attempting to change to page:', newPage);
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    const formatPrice = (price) => {
        return parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

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
                        <p className="price">
                             {product.price ? `${formatPrice(product.price)} VND` : 'Price not available'}
                        </p>
                        {product.stock <= 0 ? (
                            <p className="out-of-stock">Out of Stock</p>
                        ) : (
                            <button className="add-to-cart" onClick={() => handleAddToCart(product)}>Add to cart</button>
                        )}
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Previous
                </button>
                <span className="page-info">{currentPage} / {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
            <button onClick={() => navigate('/cart')} className="view-cart-button">
                View Cart
            </button>
        </div>
    );
};

export default ProductList;
