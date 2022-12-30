import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
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
           
            const pID = act === "update" ? product.product : product._id;
            const itemIndex = state.cartItems.findIndex((item) => item.product === pID);
            if(itemIndex >= 0) {
                if (act === "add") {
                    state.cartItems[itemIndex].cartQty += qty;
                    toast.info("Incrimented the product quantity by " + qty, {
                        position: "bottom-left"
                    });
                } else if (act === "update") {
                    state.cartItems[itemIndex].cartQty = qty;
                    toast.info("Updated the product quantity by " + qty, {
                        position: "bottom-left"
                    });
                }
            } else {
                //const tempProduct = {...product, product: product._id, cartQty: qty}
                if(state.cartItems.length > 0 && product.seller._id !== state.cartItems[0].seller._id) {
                    toast.error("Cannot add product from different seller to the Cart. Please " +
                    "buy from one seller at a time!", {position: "top-center"});
                    return; 
                } else {
                    const tempProduct = {
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    countInStock: product.countInStock,
                    product: product._id,
                    seller: product.seller,
                    cartQty: qty,
                }
                state.cartItems.push(tempProduct);
                toast.success("Added the product to cart", {
                    position: "bottom-left"
                });
                }
                
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        removeFromCart(state, action) {
            //const { itemId } = action.payload;
            const filteredCartItems = state.cartItems.filter(
                cartItem => cartItem.product !== action.payload.product
            )
            state.cartItems = filteredCartItems;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        saveShippingAddress(state, action) {
            localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
            return {
                ...state,
                shippingAddress: action.payload
            }
        },
        savePaymentMethod(state, action) {
            return {
                ...state,
                paymentMethod: action.payload
            }
            
        },
        emptyCart(state, action) {
            return {
                ...state,
                cartItems: [],
            }
        }
    },
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, emptyCart } = cartSlice.actions;

export default cartSlice.reducer;