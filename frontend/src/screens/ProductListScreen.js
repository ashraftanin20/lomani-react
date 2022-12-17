import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { productFetch } from '../features/ProductSlice';
import { createProduct, resetCreateProduct } from '../features/CreateProductSlice';
import { deleteProduct, resetDeleteProduct } from '../features/DeleteProductSlice';

export default function ProductListScreen() {
    
    const products = useSelector(state => state.products);
    const { items, error, status } = products;

    const productCreate = useSelector(state => state.productCreate);
    const {
        product: createdProduct, 
        error: createdError, 
        status: statusLoading,
    } = productCreate;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const productDelete = useSelector(state => state.productDelete);
    const {status: deleteStatus, error: deleteError} = productDelete;

    const deleteHandler = (product) => {
        if (window.confirm('Are you sure you want to delete the product?')) {
            dispatch(deleteProduct(product._id));
        }
        
    }
    
    
    const createHandler = (e) => {
        e.preventDefault();
        dispatch(createProduct());
    }

    useEffect(() => {
        if(statusLoading === "fulfilled") {
            dispatch(resetCreateProduct());
            navigate(`/product/${createdProduct._id}/edit`); 
        }  
        if(deleteStatus === 'fulfilled') {
            dispatch(resetDeleteProduct());
        } 
        dispatch(productFetch());
    }, [dispatch, createdProduct._id, navigate, statusLoading, deleteStatus]);
    
  return (
    <div>
        <div className='row'>
            <h1>Products</h1>
            <button type='button' className='primary' onClick={createHandler} >
                Create Product
            </button>
        </div>
        {deleteStatus === "pending" && (<LoadingBox>Deleting...</LoadingBox>)}
        {deleteStatus === "rejected" && (<MessageBox variant="danger">{deleteError}</MessageBox>)}
        {statusLoading === "pending" && (<LoadingBox>Creating...</LoadingBox>) }
        {statusLoading === "rejected" && (<MessageBox variant="danger">{createdError}</MessageBox>)}
        {status === "pending" && (<LoadingBox>Loading...</LoadingBox> ) }
        { status === "rejected" && (<MessageBox variant="danger">{error}</MessageBox>) }
    
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
    </div>
  )
}
