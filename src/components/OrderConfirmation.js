import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from './CartContext';
import api from '../services/api';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const orderId = location.state?.orderId;
            if (!orderId) {
                toast.error('Không tìm thấy thông tin đơn hàng.');
                navigate('/');
                return;
            }

            try {
                setLoading(true);
                const orderResponse = await api.get(`/orders/${orderId}`);
                setOrder(orderResponse.data);

                const itemsResponse = await api.get(`/orderItems?orderId=${orderId}`);
                setOrderItems(itemsResponse.data);
            } catch (error) {
                console.error('Failed to fetch order details:', error);
                toast.error('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [location.state, navigate]);

    const handleRemoveItem = async (itemId) => {
        try {
            await api.delete(`/orderItems/${itemId}`);
            const updatedItems = orderItems.filter(item => item.id !== itemId);
            setOrderItems(updatedItems);

            // Recalculate total
            const updatedTotal = calculateTotal(updatedItems);
            setOrder(prevOrder => ({ ...prevOrder, totalAmount: updatedTotal }));

            toast.success('Xóa sản phẩm thành công!');
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Xóa sản phẩm thất bại. Vui lòng thử lại sau.');
        }
    };

    const handleDeleteOrder = async () => {
        try {
            await api.delete(`/orders/${order.id}`);
            clearCart();
            toast.success('Xóa đơn hàng thành công!');
            navigate('/');
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Xóa đơn hàng thất bại. Vui lòng thử lại sau.');
        }
    };

    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    if (loading) {
        return <div>Đang tải thông tin đơn hàng...</div>;
    }

    if (!order) {
        return <div>Không tìm thấy thông tin đơn hàng.</div>;
    }
    const totalItems = orderItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="order-confirmation">
            <h2>Xác nhận đơn hàng</h2>
            <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.</p>
            <p>Mã đơn hàng: ORD-{order.id.toString().padStart(6, '0')}</p>
            <h3>Chi tiết đơn hàng:</h3>
            {orderItems.length > 0 ? (
                <ul className="order-items">
                    {orderItems.map((item) => (
                        <li key={item.id} className="order-item">
                            <div className="order-item-details">
                                <div className="order-item-name">{item.name}</div>
                                <div>Số lượng: {item.quantity}</div>
                                <div>Giá: {item.price * item.quantity} VND</div>
                            </div>
                            <button onClick={() => handleRemoveItem(item.id)}>Xóa</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không có thông tin chi tiết về các mặt hàng.</p>
            )}
            <div className="order-summary">
                <p>Tổng số sản phẩm: {totalItems}</p>
                <p>Tổng cộng: {calculateTotal(orderItems)} VND</p>
            </div>
            <button onClick={handleDeleteOrder} className="delete-order-btn">Xóa đơn hàng</button>
        </div>
    );
};

export default OrderConfirmation;