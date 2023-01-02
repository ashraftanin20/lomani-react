import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { detailsUser } from '../features/ProfileSlice';
import { productFetch } from '../features/ProductSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import Product from '../components/Product';

function SellerScreen () {
    const { id } = useParams();
    const dispatch = useDispatch();
    const userProfile = useSelector(state => state.userProfile);
    const {user, status, error} = userProfile;
    
    const products = useSelector(state => state.products);
    const {items, status: productStatus, error: productError} = products;
    
    useEffect(() => {
        dispatch(detailsUser(id));
        dispatch(productFetch({seller:id}));
    }, [dispatch, id]);
    return (
        <div className='row top'>
            <div className='col-1'>
                { status === "pending" && (<LoadingBox>Loading...</LoadingBox>)}
                {status === "rejected" && (<MessageBox variant="danger">{error}</MessageBox>)}
                { status === "fulfilled" &&
                (
                    <ul className="card card-body">
                        <li>
                            <div className="row start">
                                <div className="p-1">
                                    <img className="small" src={user.seller.logo} alt={user.seller.name} />
                                </div>
                                <div className="p-1">
                                    <h1>{user.seller.name}</h1>
                                </div>
                            </div>
                        </li>
                        <li>
                            <Rating value={user.seller.rating} text={`${user.seller.numReviews} reviews`}>

                            </Rating>
                        </li>
                        <li>
                            <a href={`mailto:${user.email}`}>Contact Seller</a>
                        </li>
                        <li>
                            {user.seller.description}
                        </li>
                    </ul>
                )
                }
            </div>
            <div className='col-3'>
                { productStatus === "pending" && (<LoadingBox>Loading...</LoadingBox>)}
                {productStatus === "rejected" && (<MessageBox variant="danger">{productError}</MessageBox>)}
                { productStatus === "fulfilled" && (
                    <>
                    {items.length === 0 && <MessageBox>No Product Found</MessageBox>}
                    <div className="row center">
                        {items.map((item) => (
                            <Product key={item._id} product={item}></Product>
                        ))}
                    </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default SellerScreen
