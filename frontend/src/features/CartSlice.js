import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
    paymentMethod: 'PayPal',
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart (state, action) {
            const { product, qty, act } = action.payload;
            const itemIndex = state.cartItems.findIndex((item) => item._id === product._id);
            if(itemIndex >= 0) {
                if (act === "add") {
                    state.cartItems[itemIndex].cartQty += qty;
                    toast.info("Increated the product quantity by " + qty, {
                        position: "bottom-left"
                    });
                } else if (act === "update") {
                    state.cartItems[itemIndex].cartQty = qty;
                    toast.info("Updated the product quantity by " + qty, {
                        position: "bottom-left"
                    });
                }
            } else {
                const tempProduct = {...product, cartQty: qty}
                state.cartItems.push(tempProduct);
                toast.success("Added the product to cart", {
                    position: "bottom-left"
                });
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        removeFromCart(state, action) {
            //const { itemId } = action.payload;
            const filteredCartItems = state.cartItems.filter(
                cartItem => cartItem._id !== action.payload._id
            )
            state.cartItems = filteredCartItems;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        saveShippingAddress(state, action) {
            localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
        },
        savePaymentMethod(state, action) {
            return {
                ...state,
                paymentMethod: action.payload
            }
            
        }
    },
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod } = cartSlice.actions;

export default cartSlice.reducer;