//import { createStore } from 'redux';
import cartReducer from './features/CartSlice';
import { configureStore }from '@reduxjs/toolkit';
import productsReducer from './features/ProductSlice';
import createReviewReducer from './features/ReviewSlice';
import productDetailsReducer from './features/ProductDetailsSlice';
import productUpdateReducer from './features/UpdateProductSlice';
import productCreateReducer from './features/CreateProductSlice';
import productDeleteReducer from './features/DeleteProductSlice';
import productCategorySlice from './features/ProductCategorySlice';
import { productsApi } from './features/ProductsApi';
import authReducer, { loadUser } from './features/authSlice';
import orderCreateReducer from './features/OrderSlice';
import orderDetailsReducder from './features/OrderDetailsSlice';
import orderListReducer from './features/OrderListSlice';
import orderDeleteReducer from './features/DeleteOrderSlice';
import orderDeliverReducer from './features/DeliverOrderSlice';
import payOrderReducer from './features/payOrderSlice';
import OrderHistorySlice from './features/OrderHistorySlice';
import ProfileSlice from './features/ProfileSlice';
import fetchUserReducer from './features/UserSlice';
import userDeleteReducer from './features/DeleteUserSlice';
import userUpdateSlice from './features/UpdateUserSlice';
import ProfileUpdateSlice from './features/UpdateProductSlice';
import TopSellerSlice from './features/TopSellerSlice';


const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetails: productDetailsReducer,
        productUpdate: productUpdateReducer,
        productCreate: productCreateReducer,
        productDelete: productDeleteReducer,
        productCategories: productCategorySlice,
        //[productsApi.reducerPath]: productsApi.reducer,
        createProduct: productDetailsReducer,
        createReviewSlice: createReviewReducer,
        cart: cartReducer,
        auth: authReducer,
        orderCreate: orderCreateReducer,
        orderDetails: orderDetailsReducder,
        orderHistory: OrderHistorySlice,
        orderList: orderListReducer,
        orderDelete: orderDeleteReducer,
        orderDeliver: orderDeliverReducer,
        payOrderData: payOrderReducer,
        usersFetch: fetchUserReducer,
        userProfile: ProfileSlice,
        userUpdateProfile: ProfileUpdateSlice,
        userDelete: userDeleteReducer,
        userUpdate: userUpdateSlice,
        topSellerList: TopSellerSlice,
    },
    middleware: (getDefualtMiddleware) => {
        return getDefualtMiddleware().concat(productsApi.middleware);
    }
}) 

//store.dispatch(productFetch);
store.dispatch(loadUser(null));
export default store;