import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const CartContext = createContext(null);

const emptyCart = { id: null, items: [], total: 0 };

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(emptyCart);
    const [loading, setLoading] = useState(false);

    const refreshCart = useCallback(async () => {
        if (!localStorage.getItem('jwt_token')) {
            setCart(emptyCart);
            return;
        }
        setLoading(true);
        try {
            const res = await api.get('/cart');
            setCart(res.data);
        } catch (err) {
            console.error('Erreur lors du chargement du panier :', err);
            setCart(emptyCart);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addItem = async (productId, quantity = 1) => {
        const res = await api.post('/cart/items', { productId, quantity });
        setCart(res.data);
    };

    const updateItem = async (itemId, quantity) => {
        const res = await api.put(`/cart/items/${itemId}`, { quantity });
        setCart(res.data);
    };

    const removeItem = async (itemId) => {
        const res = await api.delete(`/cart/items/${itemId}`);
        setCart(res.data);
    };

    const clearCart = async () => {
        await api.delete('/cart');
        setCart(emptyCart);
    };

    const resetCart = () => setCart(emptyCart);

    const itemCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <CartContext.Provider value={{ cart, loading, itemCount, refreshCart, addItem, updateItem, removeItem, clearCart, resetCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
    }
    return ctx;
};
