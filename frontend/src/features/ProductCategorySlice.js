import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const listProductCategories = createAsyncThunk('products/listProductCategory', async (values, {rejectWithValue}) => {
    try {
        const response = await axios.get('/api/products/categories');
        return response.data;
    } catch (err) {
        const message = err.response && err.response.data.message 
                        ? err.response.data.message
                        : err.message;
        return rejectWithValue(JSON.stringify(message)); 
    }
    
});

const initialState = {
    categories: [],
    status: null,
    error: ""
}


const productCategorySlice = createSlice({
    name: "productCategories",
    initialState,
    reducers: {},
    extraReducers: {
        [listProductCategories.pending]: (state, action) => {
            state.status = "pending";
        },
        [listProductCategories.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.items = action.payload;
        },
        [listProductCategories.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    },
});

export default productCategorySlice.reducer