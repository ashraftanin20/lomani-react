import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const updateProduct = createAsyncThunk('product/updateProduct', 
                                async (product, {getState, rejectWithValue}) => {
        try {
            const { auth } = getState();
            const { userInfo } = auth;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                }
            }
            const { data } = await axios.put(`/api/products/${product._id}`, {
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                brand: product.brand,
                countInStock: product.countInStock,
                description: product.description
            }, config);
            return data.product;
        } catch(err){
            const message = err.response && err.response.data.message 
                            ? err.response.data.message
                            : err.message;
            return rejectWithValue(JSON.stringify(message)); 
        }

    }
);

const initialState = {
    status: null,
    error: "",
    product: {},
}

const updateProductSlice = createSlice({
    name: 'updateProduct',
    initialState,
    reducers: {
        resetUpdateProduct(state, action) {
            return {
                ...state,
                status: null,
                error: '',
                product: {}
            }
        }
    },
    extraReducers: {
        [updateProduct.pending]: (state, action) => {
            state.state = "pending"
        },
        [updateProduct.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.product = action.payload;
        },
        [updateProduct.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        }
    }
});

export const { resetUpdateProduct } = updateProductSlice.actions;
export default updateProductSlice.reducer;