import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { loadUser, loginUser } from "./authSlice";

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
    userDetailStatus:"",
    userDetailError:"",
    userDetailData:"",
    updateProfileStatus:"",
    updateProfileError:"",
    updateProfileData:""
};

const profileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        resetProfileUpdate(state, action) {
            return {
                ...state,
                updateProfileStatus: "",
                updateProfileError: "",
                updateProfileData: ""
            }
        }
    },
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

        builder.addCase(updateProfile.pending, (state, action) => {
            return {
                ...state,
                updateProfileStatus: "pending"
            }
        });
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            if(action.payload) {
                return {
                    ...state,
                    updateProfileData: action.payload,
                    updateProfileStatus: "fulfilled"
                }
            } else {
                return state;
            }
        });
        builder.addCase(updateProfile.rejected, (state, action) => {
            return {
                ...state,
                updateProfileStatus: "rejected",
                updateProfileError: action.payload
            }
        });
    }
});

export const { resetProfileUpdate } = profileSlice.actions;
export default profileSlice.reducer;
