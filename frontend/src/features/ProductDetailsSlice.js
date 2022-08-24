import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProductDetails = createAsyncThunk("products/fetchProductDetails", async (productId) => {
    const response = await axios.get(`/api/products/${productId}`);
    return response.data;
})

const initialState = {
    status: null,
    product: {},
}

const productDetailsSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: {
        [fetchProductDetails.pending]: (state, action) => {
            state.status = "pending";
        },
        [fetchProductDetails.fulfilled]: (state, action) => {
            state.status = "success";
            state.product = action.payload;
        },
        [fetchProductDetails.rejected]: (state, action) => {
            state.status = "rejected";
        }
    }
})

export default productDetailsSlice.reducer