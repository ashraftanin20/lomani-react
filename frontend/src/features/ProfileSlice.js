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
    status: null,
    error: "",
    user: {},
};

const profileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        resetProfile(state, action) {
            return {
                ...state,
                status: null,
                error: "",
                user: {}
            }
        }
    },
    extraReducers: {
       [detailsUser.pending]: (state, action) => {
            state.status = "pending";
        },
        [detailsUser.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.user = action.payload;
        },
        [detailsUser.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    }
});

export const { resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
