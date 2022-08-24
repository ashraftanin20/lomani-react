import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    cartItems: [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart (state, action) {
            const { product, qty } = action.payload;
            const itemIndex = state.cartItems.findIndex((item) => item._id === product._id);
            if(itemIndex >= 0) {
                state.cartItems[itemIndex].cartQty += qty;
            } else {
                const tempProduct = {...product, cartQty: qty}
                state.cartItems.push(tempProduct);
            }
        },
    },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;