import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
    product: {},
}

const createProductSlice = createSlice({
    name: 'createProduct',
    initialState,
    reducers: {
        resetCreateProduct (state, action) {
            return {

            }
        }
    },
    extraReducers: {    
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
        },
    }
});

export const { resetCreateProduct } = createProductSlice.actions;
export default createProductSlice.reducer;