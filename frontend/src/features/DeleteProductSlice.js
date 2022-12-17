import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const deleteProduct = createAsyncThunk('product/deleteProduct', 
                                    async (id, {rejectWithValue, getState}) => {
    let { auth } = getState();
    let { userInfo } = auth;
    try {
    
    let config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        }
    }
    
    const { data } = await axios.delete(`/api/products/${id}`, config);
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

const deleteProductSlice = createSlice({
    name: 'deleteProduct',
    initialState,
    reducers: {
        resetDeleteProduct (state, action) {
            return {
                ...state,
                status: null,
                error: '',
                product: {}
            }
        }
    },
    extraReducers: {    
        [deleteProduct.pending]: (state, action) => {
            state.status = "pending";
        },
        [deleteProduct.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.product = action.payload;
        },
        [deleteProduct.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    }
});

export const { resetDeleteProduct } = deleteProductSlice.actions;
export default deleteProductSlice.reducer;