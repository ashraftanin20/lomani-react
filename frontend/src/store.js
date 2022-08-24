//import { createStore } from 'redux';
import cartReducer from './features/CartSlice';
import { configureStore }from '@reduxjs/toolkit';
import productsReducer, { productFetch } from './features/ProductSlice';
import productDetailsReducer from './features/ProductDetailsSlice';
import { productsApi } from './features/ProductsApi';



const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetails: productDetailsReducer,
        [productsApi.reducerPath]: productsApi.reducer,
        cart: cartReducer,
    },
    middleware: (getDefualtMiddleware) => {
        return getDefualtMiddleware().concat(productsApi.middleware);
    }
}) 

store.dispatch(productFetch);
export default store;