import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const deleteUser = createAsyncThunk("users/deleteUser", 
                            async (userId, {getState, rejectWithValue}) => {       
    try {
        const { auth } = getState();
        const { userInfo } = auth;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
        const { data } = await axios.delete(`/api/users/${userId}`, config);
        return data.message;

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
    status: null,
    user: {}
};

const deleteUserSlice = createSlice({
    name: 'deleteUser',
    initialState,
    reducers: {
        resetDeleteUser (state, action) {
            return {
                ...state,
                status: null,
                error: '',
                user: {}
            }
        }
    },
    extraReducers: {   
        [deleteUser.pending]: (state, action) => {
            state.status = "pending";
        },
        [deleteUser.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.user = action.payload;
        },
        [deleteUser.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    }
});

export const { resetDeleteUser } = deleteUserSlice.actions;
export default deleteUserSlice.reducer;