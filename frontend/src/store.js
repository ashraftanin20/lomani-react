//import { createStore } from 'redux';
import cartReducer from './features/CartSlice';
import { configureStore }from '@reduxjs/toolkit';
import productsReducer, { productFetch } from './features/ProductSlice';
import productDetailsReducer from './features/ProductDetailsSlice';
import { productsApi } from './features/ProductsApi';
import authReducer, { loadUser } from './features/authSlice';
import orderReducer from './features/OrderSlice';
import orderDetailsReducder from './features/OrderDetailsSlice';
import payOrderReducer from './features/payOrderSlice';
import OrderHistorySlice from './features/OrderHistorySlice';
import ProfileSlice from './features/ProfileSlice';



const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetails: productDetailsReducer,
        [productsApi.reducerPath]: productsApi.reducer,
        cart: cartReducer,
        auth: authReducer,
        userProfile: ProfileSlice,
        order: orderReducer,
        orderDetails: orderDetailsReducder,
        orderHistory: OrderHistorySlice,
        payOrder: payOrderReducer,
    },
    middleware: (getDefualtMiddleware) => {
        return getDefualtMiddleware().concat(productsApi.middleware);
    }
}) 

store.dispatch(productFetch);
store.dispatch(loadUser(null));
export default store;