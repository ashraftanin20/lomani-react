//import { createStore } from 'redux';
const configureStore = require('@reduxjs/toolkit').configureStore;
const productsReducer = require('./slices/ProductsSlice');
const productDetailsReducer = require('./slices/ProductDetailsSlice');

const store = configureStore({
    reducer: {
        productList: productsReducer,
        productDetails: productDetailsReducer,
    },
}) 

module.exports = store;