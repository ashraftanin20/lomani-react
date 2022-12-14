import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    items: [],
    status: null,
    error: ""
}

export const productFetch = createAsyncThunk('products/productFetch', async (value, {rejectWithValue}) => {
    try {
        const response = await axios.get('/api/products');
        return response.data;
    } catch (err) {
        const message = err.response && err.response.data.message 
                        ? err.response.data.message
                        : err.message;
        return rejectWithValue(JSON.stringify(message)); 
    }
    
});


const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: {
        [productFetch.pending]: (state, action) => {
            state.status = "pending";
        },
        [productFetch.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.items = action.payload;
        },
        [productFetch.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    },
});

export default productSlice.reducer