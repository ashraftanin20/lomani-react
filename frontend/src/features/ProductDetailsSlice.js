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

export const createProduct = createAsyncThunk('product/createProduct', async (values, {getState, rejectWithValue}) => {

    try {
        const { auth } = getState();
        const { userInfo } = auth;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
        const { data } = await axios.post('/api/products', {}, config);
        return data.product;
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
    detailStatus:null,
    detailError:"",
    productDetail:{},
    product: {},
}

const productDetailsSlice = createSlice({
    name: "productDetails",
    initialState,
    reducers: {
        resetProductDetails (state, action) {
            return {
            }
        }
    },
    extraReducers: {
        [fetchProductDetails.pending]: (state, action) => {
            state.detailStatus = "pending";
        },
        [fetchProductDetails.fulfilled]: (state, action) => {
            state.detailStatus = "fulfilled";
            state.productDetail = action.payload;
        },
        [fetchProductDetails.rejected]: (state, action) => {
            state.detailStatus = "rejected";
            state.detailError = action.payload;
        }
        ,
        [createProduct.pending]: (state, action) => {
            state.status = "pending";
        },
        [createProduct.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.product = action.payload;
        },
        [createProduct.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        }
    }
})

export const { resetProductDetails } = productDetailsSlice.actions;
export default productDetailsSlice.reducer