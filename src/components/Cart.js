import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from './CartContext';
import api from '../services/api';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart, calculateTotalPrice } = useCart();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [shippingAddress, setShippingAddress] = useState('');

    const handleCheckout = async () => {
        if (!shippingAddress) {
            toast.error('Vui lòng nhập địa chỉ nhận hàng');
            return;
        }

        try {
            const order = {
                items: cartItems.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name,
                    image: item.image
                })),
                totalAmount: calculateTotalPrice(),
                paymentMethod,
                shippingAddress,
            };

            const response = await api.post('/orders', order);
            clearCart();
            toast.success('Đặt hàng thành công!');
            navigate('/order-confirmation', { state: { orderId: response.data.id } });
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
        }
    };

    const handleRemoveFromCart = (itemId) => {
        removeFromCart(itemId);
        toast.success('Sản phẩm đã được xóa khỏi giỏ hàng');
    };

    const formatPrice = (price) => {
        return parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <div className="cart-container">
            <h2>Giỏ hàng</h2>
            {cartItems.length === 0 ? (
                <p>Giỏ hàng trống</p>
            ) : (
                <>
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img
                                src={item.image ? `http://localhost:3333/images/${item.image}` : 'placeholder.jpg'}
                                alt={item.name}
                            />
                            <span>{item.name}</span>
                            <span>Số lượng: {item.quantity}</span>
                            <span>Giá: {formatPrice(item.price * item.quantity)} VND</span>
                            <button onClick={() => handleRemoveFromCart(item.id)}>Xóa</button>
                        </div>
                    ))}
                    <div className="checkout-form">
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="cod">Thanh toán khi nhận hàng</option>
                            <option value="bank">Thanh toán qua ngân hàng</option>
                        </select>
                        <input
                            type="text"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            placeholder="Nhập địa chỉ nhận hàng"
                        />
                    </div>
                    <div className="cart-total">
                            <strong className="price">Tổng cộng: {formatPrice(calculateTotalPrice())} VND</strong>
                    </div>
                    <div className="cart-actions">
                        <button className="checkout-button" onClick={handleCheckout}>Mua Hàng</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
