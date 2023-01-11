import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    review: [],
    status: null,
    error: ""
}

export const createReview = createAsyncThunk('products/createReview', async (values, { getState,rejectWithValue}) => {
    try {
        const { auth } = getState();
        const { userInfo } = auth;
        
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
        const response = await axios.post(`/api/products/${values.id}/reviews`, values, config);
        return response.data;
    } catch (err) {
        const message = err.response && err.response.data.message 
                        ? err.response.data.message
                        : err.message;
        return rejectWithValue(JSON.stringify(message)); 
    }
    
});


const ReviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        resetCreateReview(state, action) {
            return {
                ...state,
                status: null,
                error: "",
                user: {}
        }
      }
    },
    extraReducers: {
        [createReview.pending]: (state, action) => {
            state.status = "pending";
        },
        [createReview.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.review = action.payload;
        },
        [createReview.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    },
});

export const { resetCreateReview } = ReviewSlice.actions;
export default ReviewSlice.reducer;