import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    orders: [],
    status: null,
    error: ""
}

export const listOrders = createAsyncThunk('orders/listOrders', async (values, {rejectWithValue, getState}) => {
    try {
        const { auth } = getState();
        const { userInfo } = auth;

        const config = {
            headers: {
                Authorization: `Berear ${userInfo.token}`,
            }
        }
        const response = await axios.get(`/api/orders?seller=${values.seller}`, config);
        return response.data;
    } catch (err) {
        const message = err.response && err.response.data.message 
                        ? err.response.data.message
                        : err.message;
        return rejectWithValue(JSON.stringify(message)); 
    }
    
});


const orderSlice = createSlice({
    name: "orderList",
    initialState,
    reducers: {},
    extraReducers: {
        [listOrders.pending]: (state, action) => {
            state.status = "pending";
        },
        [listOrders.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.orders = action.payload;
        },
        [listOrders.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    },
});

export default orderSlice.reducer;