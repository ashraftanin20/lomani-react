import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProductDetails = createAsyncThunk("products/fetchProductDetails", async (productId, {rejectWithValue}) => {
    try {
    const response = await axios.get(`/api/products/${productId}`);
    return response.data;
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
    product: {},
}

const productDetailsSlice = createSlice({
    name: "productDetails",
    initialState,
    reducers: {
        resetProductDetails (state, action) {
            return {
                ...state,
                status: null,
                error: '',
                product: {}
            }
        }
    },
    extraReducers: {
        [fetchProductDetails.pending]: (state, action) => {
            state.status = "pending";
        },
        [fetchProductDetails.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.product = action.payload;
        },
        [fetchProductDetails.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        }
    }
})

export const { resetProductDetails } = productDetailsSlice.actions;
export default productDetailsSlice.reducer