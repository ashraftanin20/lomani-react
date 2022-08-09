//import { createStore } from 'redux';
const configureStore = require('@reduxjs/toolkit').configureStore;
const productsReducer = require('./slices/ProductsSlice');

const store = configureStore({
    reducer: {
        productList: productsReducer,
    },
}) 

module.exports = store;