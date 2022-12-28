import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const listTopSellers = createAsyncThunk("users/fetchUsers", 
                            async (values, {getState, rejectWithValue}) => {       
    try {
        const { auth } = getState();
        const { userInfo } = auth;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
        const { data } = await axios.get("/api/users/top-sellers", config);
        return data;

    } catch(err){
        const message = err.response && err.response.data.message 
                        ? err.response.data.message
                        : err.message;
        //dispatch({type: detailsOrder.rejected, payload: message});
        return rejectWithValue(JSON.stringify(message)); 
    }
});

const initialState = {
    error: "",
    status: "pending",
    topSellers: [],
};

const topSellerSlice = createSlice({
    name: "topSellerList",
    initialState,
    reducers: {
      
    },
    extraReducers: {
        [listTopSellers.pending]: (state, action) => {
            state.status = "pending";
        },
        [listTopSellers.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.topSellers = action.payload;
        },
        [listTopSellers.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    }
});

export default topSellerSlice.reducer;

