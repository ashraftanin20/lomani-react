import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
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
    },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;