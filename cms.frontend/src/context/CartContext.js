import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Lấy giỏ hàng từ localStorage nếu có
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('cartItems');
        return localData ? JSON.parse(localData) : [];
    });

    // Lưu vào localStorage mỗi khi cartItems thay đổi
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Thêm vào giỏ
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item => 
                    item.id === product.id 
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
    };

    // Xóa khỏi giỏ
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Cập nhật số lượng
    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    // Xóa sạch giỏ hàng
    const clearCart = () => {
        setCartItems([]);
    };

    // Tính tổng số lượng item
    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Tính tổng tiền
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartCount,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
