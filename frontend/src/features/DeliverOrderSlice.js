import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const deliverOrder = createAsyncThunk('orders/deliverOrder', 
                                    async (id, {rejectWithValue, getState}) => {
    let { auth } = getState();
    let { userInfo } = auth;
    try {
    
    let config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        }
    }
    
    const { data } = await axios.put(`/api/orders/${id}/deliver`, {},config);
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

const deliverOrderSlice = createSlice({
    name: 'orderDeliver',
    initialState,
    reducers: {
        resetDeliverOrder (state, action) {
            return {
                ...state,
                status: null,
                error: '',
                order: {}
            }
        }
    },
    extraReducers: {    
        [deliverOrder.pending]: (state, action) => {
            state.status = "pending";
        },
        [deliverOrder.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.order = action.payload;
        },
        [deliverOrder.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    }
});

export const { resetDeliverOrder } = deliverOrderSlice.actions;
export default deliverOrderSlice.reducer;