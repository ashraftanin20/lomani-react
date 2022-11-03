import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { emptyCart } from './CartSlice';


export const createOrder = createAsyncThunk("order/createOrder", 
                            async (values, {getState, rejectWithValue, dispatch}) => {       
       
    
    try {
        //const dispatch = useDispatch();
        const { auth } = getState();
        const { userInfo } = auth;
        //console.log(userInfo.token);
        //const { userInfo } = auth;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
        const { data } = await axios.post("/api/orders", {
            orderItems: values.cartItems,
            shippingAddress: values.cart.shippingAddress,
            paymentMethod: values.cart.paymentMethod,
            itemsPrice: values.itemsPrice,
            shippingPrice: values.shippingPrice,
            taxPrice: values.taxPrice,
            totalPrice: values.totalPrice,
        }, config
        
        );
        dispatch(emptyCart());
        localStorage.removeItem("cartItems");
        return data;

    } catch(err){
        console.log(err.response.data);
        return rejectWithValue(JSON.stringify(err.response.data));
        
    }
});

const initialState = {
    orderData: "",
    orderError: "",
    orderStatus: "",
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrder (state, action) {
            return {
               
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createOrder.pending, (state, action) => {
            return { ...state, orderStatus: "pending" };
        });

        builder.addCase(createOrder.fulfilled, (state, action) => {
            if(action.payload) {
                return {
                    ...state,
                    orderData: action.payload,
                    orderStatus: "fulfilled"
                };
            } else {
                return state;
            }
        });

        builder.addCase(createOrder.rejected, (state, action) => {
            return {
                ...state,
                orderStatus: "rejected",
                orderError: action.payload
            }
        });
    }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;