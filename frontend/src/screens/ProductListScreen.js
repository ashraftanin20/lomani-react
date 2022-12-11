import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { createProduct } from '../features/ProductDetailsSlice';
import { productFetch } from '../features/ProductSlice';

export default function ProductListScreen() {
    
    const products = useSelector(state => state.products);
    const { items, error, status } = products;

    const productDetails = useSelector(state => state.productDetails);
    const {
        product: createdProduct, 
        error: createdError, 
        status: statusLoading,
    } = productDetails;
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const deleteHandler = () => {
        //TODO: implement delete action here!
    }
    
    const createHandler = () => {
        dispatch(createProduct());
    }

    useEffect(() => {
        if(statusLoading === "filfilled") {
            navigate(`/product/${createdProduct._id}/edit`);
        }
        dispatch(productFetch());
    }, [createdProduct._id, dispatch, navigate, statusLoading]);
    
  return (
    <div>
        <div className='row'>
            <h1>Products</h1>
            <button type='button' className='primary' onClick={createHandler} >
                Create Product
            </button>
        </div>
        {statusLoading === "pending" ? (<LoadingBox>Creating...</LoadingBox>) :
        statusLoading === "rejected" ? (<MessageBox variant="danger">{createdError}</MessageBox>) : ""} 
        {status === "pending" ? (<LoadingBox>Loading...</LoadingBox> )
        : status === "rejected" ? (<MessageBox variant="danger">{error}</MessageBox>)
        :
        <table className='table'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>PRICE</th>
                    <th>CATEGORY</th>
                    <th>BRAND</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {items.map((product) => (
                    <tr key={product._id}>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.brand}</td>
                        <td>
                            <button type='button' className='small' onClick={() => navigate(`/product/${product._id}/edit`)}>
                                Edit
                            </button>
                            <button type='button' className='samll' onClick={() => deleteHandler(product)} >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    }
    </div>
  )
}
