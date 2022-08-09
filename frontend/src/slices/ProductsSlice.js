const createSlice = require('@reduxjs/toolkit').createSlice;
const createAsyncThunk = require('@reduxjs/toolkit').createAsyncThunk;
const axios = require('axios');

const initialState = {
    loading: false,
    products: [],
    error: ''
}

const fetchProducts = createAsyncThunk('product/fetchProducts', () => {
    return axios.get('/api/products')
    .then((response) => response.data)
})

const productSlice = createSlice({
    name: 'productList',
    initialState,
    extraReducers: builder => {
        builder.addCase(fetchProducts.pending, state => {
            state.loading = true;
        })
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false
            state.products = action.payload
            state.error = ''
        })
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false
            state.products = []
            state.error = action.error.message
        })
    },
})

module.exports = productSlice.reducer
module.exports.fetchProducts = fetchProducts