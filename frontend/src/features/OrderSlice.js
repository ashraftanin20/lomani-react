import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrder = createAsyncThunk("order/createOrder", 
                            async (values, {getState, rejectWithValue, dispatch}) => {       
       
    
    try {
        const { auth } = getState();
        const { userInfo } = auth;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
        const { data } = await axios.post("/api/orders", {
            orderItems: values.cartItems,
            shippingAddress: values.shippingAddress,
            paymentMethod: values.paymentMethod,
            itemsPrice: values.itemsPrice,
            shippingPrice: values.shippingPrice,
            taxPrice: values.taxPrice,
            totalPrice: values.totalPrice,
        }, config
        
        );
        return data.order;

    } catch(err){
        const message = err.response && err.response.data.message 
                        ? err.response.data.message
                        : err.message;
        //dispatch({type: detailsOrder.rejected, payload: message});
        return rejectWithValue(JSON.stringify(message)); 
    }
});

const initialState = {
    error: "",
    status: "pending",
    order: {}
};

const orderSlice = createSlice({
    name: "orderCreate",
    initialState,
    reducers: {
        resetOrder (state, action) {
            return {
               
            }
        }
    },
    extraReducers: {
        [createOrder.pending]: (state, action) => {
            state.status = "pending";
        },
        [createOrder.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.order = action.payload;
        },
        [createOrder.rejecte]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;

