// CartItem.js
import React from 'react';

const CartItem = ({ item, updateCartItem, removeCartItem }) => {
    const handleChange = (event) => {
        const newQuantity = parseInt(event.target.value);
        if (newQuantity > 0) {
            updateCartItem(item.id, newQuantity);
        }
    };

    const handleRemove = () => {
        removeCartItem(item.id);
    };

    return (
        <div className="cart-item">
            <h3>{item.product.name}</h3>
            <p>Quantity: <input type="number" value={item.quantity} onChange={handleChange} /></p>
            <button onClick={handleRemove}>Remove</button>
        </div>
    );
};

export default CartItem;
