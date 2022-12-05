import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk("auth/registerUser", 
                            async (values, {rejectWithValue}) => {
    try {
        const { data } = await axios.post("/api/users/register", {
            name: values.name,
            email: values.email,
            password: values.password
        });

        localStorage.setItem("userInfo", JSON.stringify(data));
        return data;
    } catch(err){
        console.log(err.response.data);
        return rejectWithValue(JSON.stringify(err.response.data));
        
    }
});

export const loginUser = createAsyncThunk(
                        "auth/loginUser", 
                        async (user, { rejectWithValue }) => {
        try {
            const { data } = await axios.post("/api/users/signin", {
                email: user.email,
                password: user.password,
            });
            
            localStorage.setItem("userInfo", JSON.stringify(data));

            return data;
        } catch (err) {
            console.log(err.response.data);
            return rejectWithValue(JSON.stringify(err.response.data));
            //return err.response.data;
        }
});



const initialState = {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : "",
    registerStatus: "",
    registerError: "",
    loginStatus: "",
    loginError: "",
    userLoaded: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loadUser(state, action) {
            const userInfo = state.userInfo;

            if(userInfo) {
                return {
                    ...state,
                    userInfo,
                    userLoaded: true,
                };
            }
        },
        logoutUser(state, action) {
            localStorage.removeItem("userInfo");
            localStorage.removeItem("cartItems");
            localStorage.removeItem("shippingAddress");
            return {
                ...state,
                userInfo: "",
                registerStatus: "",
                registerError: "",
                loginStatus: "",
                loginError: "",
                userLoaded: false,
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, action) => {
            return { ...state, registerStatus: "pending" };
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            if(action.payload) {
                return {
                    ...state,
                    userInfo: action.payload,
                    registerStatus: "success"
                };
            } else {
                return state;
            }
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            return {
                ...state,
                registerStatus: "rejected",
                registerError: action.payload
            }
        });
        builder.addCase(loginUser.pending, (state, action) => {
            return { ...state, loginStatus: "pending" };
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            if(action.payload) {
                return {
                    ...state,
                    userInfo: action.payload,
                    loginStatus: "success"
                };
            } else {
                return state;
            }
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            return {
                ...state,
                loginStatus: "rejected",
                loginError: action.payload
            }
        });
    }
});

// export const detailsUser = (userId) => async (dispatch, getState) => {

// }

export const { loadUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;