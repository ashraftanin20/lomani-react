import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getOrderHistory = createAsyncThunk("orders/getOrderHistory", 
                                async (value, {getState, rejectWithValue }) => {
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
    orders: [],
    error: "",
    status: null,
}
const orderHistorySlice = createSlice({
    name: "orderHistory",
    initialState,
    reducers: {
    },
    extraReducers: {
        [getOrderHistory.pending]: (state, action) => {
            state.status = "pending";
        },

        [getOrderHistory.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.orders = action.payload;
        },
        [getOrderHistory.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        }
    }
});

export default orderHistorySlice.reducer;