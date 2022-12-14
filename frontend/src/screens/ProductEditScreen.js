import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { fetchProductDetails } from '../features/ProductDetailsSlice';

function ProductEditScreen() {
    const { id } = useParams();
    const[name, setName] = useState('');
    const[price, setPrice] = useState('');
    const[image, setImage] = useState('');
    const[category, setCategory] = useState('');
    const[countInStock, setCountInStock] = useState('');
    const[brand, setBrand] = useState('');
    const[description, setDescription] = useState('');

    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { detailStatus: status, detailError: error, productDetail: product } = productDetails;

    const submitHandler = () => {
        // Implement onSubmit here
    }
    useEffect(() => {
        if (!product || (product._id !== id)) {
            dispatch(fetchProductDetails(id));
        } else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setBrand(product.brand);
            setDescription(product.description);
        }
    },[product, dispatch, id]);
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Edit Product</h1>
                </div>
                {status === 'pending' ? (<LoadingBox>Loading...</LoadingBox>) : 
                status === 'rejected' ? (<MessageBox varian="danger">{error}</MessageBox>) :
                <>
                    <div>
                        <label htmlFor='name'>Name</label>
                        <input id='name' type='text' placeholder='Enter Name' value={name} 
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor='price'>Price</label>
                        <input id='price' type='text' placeholder='Enter Price' value={price} 
                            onChange={(e) => setPrice(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor='image'>Image</label>
                        <input id='image' type='text' placeholder='Enter Image' value={image} 
                            onChange={(e) => setImage(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor='category'>Category</label>
                        <input id='category' type='text' placeholder='Enter Category' value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor='brand'>Brand</label>
                        <input id='brand' type='text' placeholder='Enter Brand' value={brand} 
                            onChange={(e) => setBrand(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor='countInStock'>Count In Stock</label>
                        <input id='countInStock' type='number' placeholder='Enter Amount' value={countInStock} 
                            onChange={(e) => setCountInStock(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor='description'>Description</label>
                        <textarea id='description' type='text' placeholder='Enter description' value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div>
                        <label></label>
                        <button className='primary' type='submit'>
                            Update Product
                        </button>
                    </div>
                </>
                }
            </form>
        </div>
    )
}

export default ProductEditScreen
