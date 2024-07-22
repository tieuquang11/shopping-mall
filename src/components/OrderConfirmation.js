import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from './CartContext';
import api from '../services/api';
import './OrderConfirmation.css';

const OrderConfirmation = ({ currentUser }) => {
    const location = useLocation();
    const navigate = useNavigate();
    useCart();
    const [order, setOrder] = useState(null);
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
                const response = await api.get(`/orders/${orderId}`);
                setOrder(response.data);
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

    const handlePayment = async () => {
        if (order.paymentMethod === 'bank') {
            try {
                const response = await api.post(`/orders/${order.id}/process-payment`, {
                    paymentMethod: 'bank'
                });
                if (response.data.message === 'Thanh toán thành công') {
                    toast.success('Thanh toán thành công!');
                    setOrder({ ...order, status: 'paid' });
                } else {
                    toast.error('Thanh toán thất bại. Vui lòng thử lại.');
                }
            } catch (error) {
                console.error('Payment error:', error);
                toast.error('Có lỗi xảy ra khi xử lý thanh toán.');
            }
        }
    };

    if (loading) {
        return <div>Đang tải thông tin đơn hàng...</div>;
    }

    if (!order) {
        return <div>Không tìm thấy thông tin đơn hàng.</div>;
    }

    const formatPrice = (price) => {
        return parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <div className="order-confirmation">
            <h2>Xác nhận đơn hàng</h2>
            <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.</p>
            <p>Mã đơn hàng: ORD-{order.id.toString().padStart(6, '0')}</p>
            <p>Tên khách hàng: {currentUser?.name || order.user?.name || 'Không có thông tin'}</p>
            <p>Email: {currentUser?.email || order.user?.email || 'Không có thông tin'}</p>
            <p>Số điện thoại: {currentUser?.phone || order.user?.phone || 'Không có thông tin'}</p>
            <p>Địa chỉ: {currentUser?.address || order.shippingAddress || 'Không có thông tin'}</p>
            <p>Trạng thái: {order.status}</p>
            <p>Phương thức thanh toán: {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua ngân hàng'}</p>
            <p>Địa chỉ nhận hàng: {order.shippingAddress}</p>
            <h3>Chi tiết đơn hàng:</h3>
            {order.orderItems.length > 0 ? (
                <ul className="order-items">
                    {order.orderItems.map((item) => (
                        <li key={item.id} className="order-item">
                            <img
                                src={item.image ? `http://localhost:3333/images/${item.image}` : 'placeholder.jpg'}
                                alt={item.name}
                                className="order-item-image"
                            />
                            <div className="order-item-details">
                                <div className="order-item-name">{item.name}</div>
                                <div>Số lượng: {item.quantity}</div>
                                <div>Giá: {formatPrice(item.price * item.quantity)} VND</div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không có thông tin chi tiết về các mặt hàng.</p>
            )}
            <div className="order-summary">
                <p className="price">Tổng cộng: {formatPrice(order.totalAmount)} VND</p>
            </div>
            {order.paymentMethod === 'bank' && order.status !== 'paid' && (
                <button onClick={handlePayment} className="payment-btn">Tiến hành thanh toán</button>
            )}
        </div>
    );
};

export default OrderConfirmation;