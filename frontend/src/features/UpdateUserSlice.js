import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const updateUserData = createAsyncThunk('users/updateUser', 
                                async (user, {getState, rejectWithValue}) => {
        try {
            const { auth } = getState();
            const { userInfo } = auth;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                }
            }
            const { data } = await axios.put(`/api/users/${user._id}`, {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isSeller: user.isSeller,
            }, config);
            return data.user;
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
    user: {},
}

const updateUserSlice = createSlice({
    name: 'userUpdate',
    initialState,
    reducers: {
        resetUpdateUser(state, action) {
            return {
                ...state,
                status: null,
                error: '',
                user: {}
            }
        }
    },
    extraReducers: {
        [updateUserData.pending]: (state, action) => {
            state.state = "pending"
        },
        [updateUserData.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.user = action.payload;
        },
        [updateUserData.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        }
    }
});

export const { resetUpdateUser } = updateUserSlice.actions;
export default updateUserSlice.reducer;