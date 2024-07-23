/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './UserProducts.css';

const UserProducts = ({ currentUser }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchUserProducts();
 
    }, [currentPage]);

    const fetchUserProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/user/products', {
                params: { page: currentPage, limit: 3 }
            });
            const { data, meta } = response.data;
            setProducts(data);
            setTotalPages(meta.last_page);
        } catch (error) {
            console.error('Failed to fetch user products:', error);
            toast.error('Failed to fetch your products');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/user/products/${id}`);
                toast.success('Product deleted successfully');
                fetchUserProducts();
            } catch (error) {
                console.error('Failed to delete product:', error);
                toast.error('Failed to delete product');
            }
        }
    };

    const handlePageChange = (newPage) => {
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
        <div className="user-products">
            <h2>My Products</h2>
            <Link to="/user/product/new" className="add-product-btn">Add New Product</Link>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{formatPrice(product.price)} VND</td>
                            <td>{product.stock}</td>
                            <td>
                                <Link to={`/user/product/edit/${product.id}`} className="edit-btn"><FaEdit /></Link>
                                <button onClick={() => handleDeleteProduct(product.id)} className="delete-btn"><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default UserProducts;