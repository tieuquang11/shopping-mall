import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaUsers, FaBoxOpen, FaEdit, FaTrash, FaShoppingCart, FaUserPlus, FaClipboardList, FaCheckCircle, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = ({ currentUser }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [statistics, setStatistics] = useState({
        totalUsers: 0,
        totalOrders: 0,
        completedOrders: 0
    });

    useEffect(() => {
        fetchUsers();
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data);
            setStatistics(prev => ({ ...prev, totalUsers: response.data.data.length }));
        } catch (error) {
            console.error('Không thể lấy danh sách người dùng:', error);
            toast.error('Không thể lấy danh sách người dùng');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products?limit=1000');
            setProducts(response.data.data);
        } catch (error) {
            console.error('Không thể lấy danh sách sản phẩm:', error);
            toast.error('Không thể lấy danh sách sản phẩm');
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
            const completedOrders = response.data.filter(order => order.status === 'paid').length;
            setStatistics(prev => ({
                ...prev,
                totalOrders: response.data.length,
                completedOrders: completedOrders
            }));
        } catch (error) {
            console.error('Không thể lấy danh sách đơn hàng:', error);
            toast.error('Không thể lấy danh sách đơn hàng');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
                toast.success('Đã xóa sản phẩm thành công');
            } catch (error) {
                console.error('Không thể xóa sản phẩm:', error);
                toast.error('Không thể xóa sản phẩm');
            }
        }
    };

    const handleEditUser = (id) => {
        navigate(`/user/edit/${id}`);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
                toast.success('Đã xóa người dùng thành công');
            } catch (error) {
                console.error('Không thể xóa người dùng:', error);
                toast.error('Không thể xóa người dùng');
            }
        }
    };

    const handleUpdateOrderStatus = async (id, newStatus) => {
        try {
            await api.put(`/orders/${id}`, { status: newStatus });
            fetchOrders();
            toast.success('Đã cập nhật trạng thái đơn hàng thành công');
        } catch (error) {
            console.error('Không thể cập nhật trạng thái đơn hàng:', error);
            toast.error('Không thể cập nhật trạng thái đơn hàng');
        }
    };

    const handleViewOrder = (order) => {
        navigate(`/order-confirmation/${order.id}`, { state: { orderId: order.id } });
    };

    return (
        <div className="admin-dashboard">
            <div className="statistics-widgets">
                <div className="widget">
                    <FaUserPlus className="widget-icon" />
                    <div className="widget-content">
                        <h3>{statistics.totalUsers}</h3>
                        <p>Tổng số người dùng</p>
                    </div>
                </div>
                <div className="widget">
                    <FaClipboardList className="widget-icon" />
                    <div className="widget-content">
                        <h3>{statistics.totalOrders}</h3>
                        <p>Tổng số đơn hàng</p>
                    </div>
                </div>
                <div className="widget">
                    <FaCheckCircle className="widget-icon" />
                    <div className="widget-content">
                        <h3>{statistics.completedOrders}</h3>
                        <p>Đơn hàng đã thanh toán</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="sidebar">
                    <h2>Quản Lý</h2>
                    <ul>
                        <li onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>
                            <FaUsers /> Người dùng
                        </li>
                        <li onClick={() => setActiveTab('products')} className={activeTab === 'products' ? 'active' : ''}>
                            <FaBoxOpen /> Sản phẩm
                        </li>
                        <li onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>
                            <FaShoppingCart /> Đơn hàng
                        </li>
                    </ul>
                </div>

                <div className="main-content">
                    {activeTab === 'users' && (
                        <section className="user-management">
                            <h2>Quản lý người dùng</h2>
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>Tên</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <button onClick={() => handleEditUser(user.id)} className="edit-btn"><FaEdit /></button>
                                                <button onClick={() => handleDeleteUser(user.id)} className="delete-btn"><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}

                    {activeTab === 'products' && (
                        <section className="product-management">
                            <h2>Quản lý sản phẩm</h2>
                            <Link to="/product/new" className="add-product-btn">Thêm sản phẩm mới</Link>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên</th>
                                        <th>Giá</th>
                                        <th>Tồn kho</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>{product.name}</td>
                                            <td>${product.price}</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <Link to={`/product/edit/${product.id}`} className="edit-btn"><FaEdit /></Link>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="delete-btn"><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}

                    {activeTab === 'orders' && (
                        <section className="order-management">
                            <h2>Quản lý đơn hàng</h2>
                            <table className="order-table">
                                <thead>
                                    <tr>
                                        <th>Mã đơn hàng</th>
                                        <th>Khách hàng</th>
                                        <th>Tổng tiền</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => {
                                        const user = users.find(u => u.id === order.userId);
                                        return (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{user ? user.name : 'Không có thông tin'}</td>
                                                <td>${order.totalAmount}</td>
                                                <td>{order.status}</td>
                                                <td>
                                                    <button onClick={() => handleViewOrder(order)} className="view-btn"><FaEye /> Xem</button>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                    >
                                                        <option value="pending">Đang chờ</option>
                                                        <option value="processing">Đang xử lý</option>
                                                        <option value="shipped">Đã gửi hàng</option>
                                                        <option value="delivered">Đã giao hàng</option>
                                                        <option value="paid">Đã thanh toán</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;