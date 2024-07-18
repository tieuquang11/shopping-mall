import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from './CartContext';
import api from '../services/api';
import './Cart.css';
const Cart = () => {
    const { cartItems, removeFromCart, clearCart, calculateTotalPrice } = useCart();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        try {
            const order = {
                items: cartItems.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                totalAmount: calculateTotalPrice(),
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
                            <span>Giá: {item.price * item.quantity} VND</span>
                            <button onClick={() => removeFromCart(item.id)}>Xóa</button>
                        </div>
                    ))}
                    <div className="cart-total">
                        <strong>Tổng cộng: {calculateTotalPrice()} VND</strong>
                    </div>
                    <button className="checkout-button" onClick={handleCheckout}>Thanh toán</button>
                </>
            )}
        </div>
    );
};

export default Cart;