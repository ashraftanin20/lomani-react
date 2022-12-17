import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { fetchProductDetails } from '../features/ProductDetailsSlice';
import { resetUpdateProduct, updateProduct } from '../features/UpdateProductSlice';

function ProductEditScreen() {
    const { id } = useParams();
    const[name, setName] = useState('');
    const[price, setPrice] = useState('');
    const[image, setImage] = useState('');
    const[category, setCategory] = useState('');
    const[countInStock, setCountInStock] = useState('');
    const[brand, setBrand] = useState('');
    const[description, setDescription] = useState('');
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const { userInfo } = auth;

    const productDetails = useSelector(state => state.productDetails);
    const { status, error, product } = productDetails;
    const productUpdate = useSelector(state => state.productUpdate);
    const {status: updateStatus, error: updateError } = productUpdate;

    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');
    const uploadFileHandler = async (e) => {
        const file = e.target.value[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        const bodyFormData = new FormData();
        bodyFormData.append('image', reader.result);
        setLoadingUpload(true);
        try {
            const config = {
                headers: {
                    'Content-Type':'multipart/form-data',
                    Authorization:`Bearer ${userInfo.token}`,
                }
            }
            const { data } = await axios.post('/api/uploads', bodyFormData, config);
            setImage(data);
            setLoadingUpload(false);
        } catch (err) {
            const message = err.response && err.response.data.message 
                            ? err.response.data.message
                            : err.message;
            setErrorUpload(message);
            setLoadingUpload(false);
        }
    }
    const submitHandler = (e) => {
        // Implement onSubmit here
        e.preventDefault();
        dispatch(updateProduct({_id: id,
                                    name, price, image, category, brand, countInStock, description})
                );
    }
    useEffect(() => {
        if(updateStatus === 'fulfilled') {
            dispatch(resetUpdateProduct());
            navigate('/productlist');
        }
        if (!product || (product._id !== id) || updateStatus === 'fulfilled') {
            dispatch(resetUpdateProduct());
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
    },[product, dispatch, id, updateStatus, navigate, setImage]);
    return (
        <div>
                  {  updateStatus === "pending" && <LoadingBox>Loading...</LoadingBox> }
                  {  updateStatus === "rejected" && <MessageBox variant="danger">{updateError}</MessageBox> }
            <form className="form" onSubmit={submitHandler} encType="multipart/form-data">
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
                        <label htmlFor='imageFile'>Image File</label>
                        <input type='file' id='imageFile' label='Choose Image'
                            onChange={uploadFileHandler}
                        ></input>
                        {loadingUpload && <LoadingBox></LoadingBox>}
                        {errorUpload && <MessageBox variant="danger">{errorUpload}</MessageBox>}
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
