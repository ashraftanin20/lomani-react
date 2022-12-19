import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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

        return data;

    } catch(err){
        const message = err.response && err.response.data.message 
        ? err.response.data.message
        : err.message;
        //dispatch({type: detailsOrder.rejected, payload: message});
        return rejectWithValue(JSON.stringify(message)); 
    }
});

const initialState = {
    payOrderError: "",
    payOrderStatus: "pending",
};
const payOrderSlice = createSlice({
    name: "payOrder",
    initialState,
    reducers: {
    
    },
    extraReducers: (builder) => {
        builder.addCase(payOrder.pending, (state, action) => {
            return { ...state, payOrderStatus: "pending" };
        });

        builder.addCase(payOrder.fulfilled, (state, action) => {
            if(action.payload) {
                return {
                    ...state,
                    payOrderData: action.payload,
                    payOrderStatus: "fulfilled"
                };
            } else {
                return state;
            }
        });

        builder.addCase(payOrder.rejected, (state, action) => {
            return {
                ...state,
                payOrderStatus: "rejected",
                payOrderError: action.payload
            }
        });
    }
});

export default payOrderSlice.reducer;
