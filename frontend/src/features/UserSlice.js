import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk("users/fetchUsers", 
                            async (values, {getState, rejectWithValue}) => {       
    try {
        const { auth } = getState();
        const { userInfo } = auth;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
        const { data } = await axios.get("/api/users", config);
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
    users: [],
};

const usersSlice = createSlice({
    name: "usersFetch",
    initialState,
    reducers: {
      
    },
    extraReducers: {
        [fetchUsers.pending]: (state, action) => {
            state.status = "pending";
        },
        [fetchUsers.fulfilled]: (state, action) => {
            state.status = "fulfilled";
            state.users = action.payload;
        },
        [fetchUsers.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    }
});

export default usersSlice.reducer;

