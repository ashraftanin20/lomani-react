import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const detailsOrder = createAsyncThunk("order/getOrder", 
                                async (orderId, {getState, rejectWithValue, dispatch}) => {
    try {
        const { auth } = getState();
        const { userInfo } = auth;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
        const { data } = await axios.get(`/api/orders/${orderId}`, config);
        //dispatch({type: detailsOrder.fulfilled, payload: data});
        return data;
    } catch (err) {
        const message = err.response && err.response.data.message 
                        ? err.response.data.message
                        : err.message;
        //dispatch({type: detailsOrder.rejected, payload: message});
        return rejectWithValue(JSON.stringify(message));
    }
});
const initialState = {
    orderDetailsData: "",
    orderDetailsError: "",
    orderDetailsStatus: "",
}
const orderDetailsSlice = createSlice({
    name: "orderDetails",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(detailsOrder.pending, (state, action) => {
            return { ...state, orderDetailsStatus: "pending" };
        });

        builder.addCase(detailsOrder.fulfilled, (state, action) => {
            if(action.payload) {
                return {
                    ...state,
                    orderDetailsData: action.payload,
                    orderDetailsStatus: "fulfilled",
                };
            } else {
                return state;
            }
        });

        builder.addCase(detailsOrder.rejected, (state, action) => {
            return {
                ...state,
                orderDetailsStatus: "rejected",
                orderDetailsError: action.payload
            }
        });
    }
});

export default orderDetailsSlice.reducer;