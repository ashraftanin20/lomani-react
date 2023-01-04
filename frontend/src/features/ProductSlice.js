import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    items: [],
    status: null,
    error: ""
}

export const productFetch = createAsyncThunk('products/productFetch', async (values, {rejectWithValue}) => {
    try {
        const seller = values.seller || '';
        const name = values.name || '';
        const category = values.category || '';
        const min = values.min || 0;
        const max = values.max || 0;
        const rating = values.rating || 0;
        const order = values.order || '';
        const response = await axios.get(`/api/products?seller=${seller}&name=${name}&category=${category}&min=${min}&max=${max}&rating=${rating}&order=${order}`);
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