import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const detailsUser = createAsyncThunk("user/detailsUser", 
                            async (userId, {getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const { userInfo } = auth;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
        const { data } = await axios.get(`/api/users/${userId}`, config);

        return data;
    } catch(err){
        const message = err.response && err.response.data.message 
                        ? err.response.data.message
                        : err.message;
        return rejectWithValue(JSON.stringify(message));
    }
});

const initialState = {
    userDetailStatus:"",
    userDetailError:"",
    userDetailData:"",
};

const profileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(detailsUser.pending, (state, action) => {
            return {
                ...state,
                userDetailStatus: "pending"
            }
        });
        builder.addCase(detailsUser.fulfilled, (state, action) => {
            if (action.payload) {
                return {
                    ...state,
                    userDetailData: action.payload,
                    userDetailStatus: "fulfilled"
                }
            } else {
                return state;
            }
        });
        builder.addCase(detailsUser.rejected, (state, action) => {
            return {
                ...state,
                userDetailError: action.payload,
                userDetailStatus: "rejected"
            }
        });
    }
});

export default profileSlice.reducer;
