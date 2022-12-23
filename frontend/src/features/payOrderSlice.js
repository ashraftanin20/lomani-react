import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { emptyCart } from "./CartSlice";

export const payOrder = createAsyncThunk("orders/payOrder", 
    async (values, {getState, rejectWithValue, dispatch}) => {       

    try {
        const { auth } = getState();
        const { userInfo } = auth;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
        const { data } = await axios.put(`/api/orders/${values.orderDetailsData._id}/pay`, 
            values.paymentResult,
            config
        );
        dispatch(emptyCart());
        localStorage.removeItem("cartItems");
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
    status: null,
    error: "",
    order: {}
};
const payOrderSlice = createSlice({
    name: "payOrderData",
    initialState,
    reducers: {
        resetPayOrder(state, action) {
            return {
                ...state,
                status: null,
                error: '',
                order: {}
            }
        }
    },
    extraReducers: {    
            [payOrder.pending]: (state, action) => {
                state.status = "pending";
            },
            [payOrder.fulfilled]: (state, action) => {
                state.status = "fulfilled";
                state.order = action.payload;
            },
            [payOrder.rejected]: (state, action) => {
                state.status = "rejected";
                state.error = action.payload;
            },
    }
});

export const { resetPayOrder } = payOrderSlice.actions;
export default payOrderSlice.reducer;
