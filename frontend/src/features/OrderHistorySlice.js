import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getOrderHistory = createAsyncThunk("order/getOrderHistory", 
                                async ( value, {getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const { userInfo } = auth;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
        const { data } = await axios.get('/api/orders/mine', config);
        //dispatch({type: detailsOrder.fulfilled, payload: data});
        return data;
    } catch (err) {
        const message = err.response && err.response.data.message 
                        ? err.response.data.message
                        : err.message;
        //dispatch({type: detailsOrder.rejected, payload: message});
        return rejectWithValue(JSON.stringify(message));
    }
});
const initialState = {
    orderHistoryData: [],
    orderHistoryError: "",
    orderHistoryStatus: "",
}
const orderHistorySlice = createSlice({
    name: "orderHistory",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getOrderHistory.pending, (state, action) => {
            return { ...state, orderHistoryStatus: "pending" };
        });

        builder.addCase(getOrderHistory.fulfilled, (state, action) => {
            if(action.payload) {
                return {
                    ...state,
                    orderHistoryData: action.payload,
                    orderHistoryStatus: "fulfilled",
                };
            } else {
                return state;
            }
        });

        builder.addCase(getOrderHistory.rejected, (state, action) => {
            return {
                ...state,
                orderHistoryStatus: "rejected",
                orderHistoryError: action.payload
            }
        });
    }
});

export default orderHistorySlice.reducer;