import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const deleteOrder = createAsyncThunk('orders/deleteOrder', 
                                    async (id, {rejectWithValue, getState}) => {
    let { auth } = getState();
    let { userInfo } = auth;
    try {
    
    let config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        }
    }
    
    const { data } = await axios.delete(`/api/orders/${id}`, config);
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
    order: {},
}

const deleteOrderSlice = createSlice({
    name: 'deleteOrder',
    initialState,
    reducers: {
        resetDeleteOrder (state, action) {
            return {
                ...state,
                status: null,
                error: '',
                order: {}
            }
        }
    },
    extraReducers: {    
        [deleteOrder.pending]: (state, action) => {
            state.status = "pending";
        },
        [deleteOrder.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.order = action.payload;
        },
        [deleteOrder.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    }
});

export const { resetDeleteOrder } = deleteOrderSlice.actions;
export default deleteOrderSlice.reducer;