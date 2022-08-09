const createSlice = require('@reduxjs/toolkit').createSlice;
const createAsyncThunk = require('@reduxjs/toolkit').createAsyncThunk;
const axios = require('axios');

const initialState = {
    loading: false,
    product: {},
    error: ''
}

const detailsProduct = createAsyncThunk('product/fetchProductDetails', (productId) => {
    return axios.get(`/api/products/${productId}`)
    .then((response) => response.data)
})

const productDetailsSlice = createSlice({
    name: 'productDetails',
    initialState,
    extraReducers: builder => {
        builder.addCase(detailsProduct.pending, state => {
            state.loading = true;
        })
        builder.addCase(detailsProduct.fulfilled, (state, action) => {
            state.loading = false
            state.product = action.payload
            state.error = ''
        })
        builder.addCase(detailsProduct.rejected, (state, action) => {
            state.loading = false
            state.product = {}
            state.error = action.error.message
        })
    },
})

module.exports = productDetailsSlice.reducer
module.exports.detailsProduct = detailsProduct