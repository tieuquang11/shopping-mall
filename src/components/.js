import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    if (!order) {
        navigate('/');
        return null;
    }

    const formatPrice = (price) => {
        return parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <div className="order-confirmation">
            <h2>Order Confirmation</h2>
            <p>Thank you for your order! Your order details are below:</p>
            <div className="order-details">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                <h3>Items:</h3>
                <ul>
                    {order.items.map(item => (
                        <li key={item.id}>
                            {item.product.name} - Quantity: {item.quantity} - Price: {formatPrice(item.price)}VND
                        </li>
                    ))}
                </ul>
                <p><strong>Total:</strong> {formatPrice(order.total)}VND</p>
            </div>
            <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
    );
};

export default OrderConfirmation;