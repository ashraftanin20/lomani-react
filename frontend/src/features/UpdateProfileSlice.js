import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const updateProfile = createAsyncThunk('/user/updateProfile', async (
    user, {getState, rejectWithValue, dispatch}) => {

        try {
            const { auth } = getState();
            const { userInfo } = auth;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                }
            }
            const { data } = await axios.put('/api/users/profile', user, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
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
    error: '',
    user: {}
};

const profileUpdateSlice = createSlice({
    name: "userUpdateProfile",
    initialState,
    reducers: {
        resetProfileUpdate(state, action) {
            return {
                ...state,
                status: null,
                error: "",
                user: {}
            }
        }
    },
    extraReducers: {
        [updateProfile.pending]: (state, action) => {
           state.status = "pending"
        },
        [updateProfile.fulfilled]: (state, action) => {
            state.user = action.payload;
            state.status = "fulfilled";
        },
        [updateProfile.rejected]: (state, action) => {
                state.status = "rejected";
                state.error = action.payload;
        }
    }
});

export const { resetProfileUpdate } = profileUpdateSlice.actions;
export default profileUpdateSlice.reducer;
