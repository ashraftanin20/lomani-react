import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { productFetch } from '../features/ProductSlice';
import Product from '../components/Product';

function SearchScreen() {
    const { name = 'all'} = useParams();

    const products = useSelector(state => state.products);
    const { items, error, status } = products;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(productFetch({name: name !== 'all' ? name : ''}));
    },[dispatch, name]);
    return (
        <div>
            <div className="row">
            { status === "pending" ? (<LoadingBox>Loading...</LoadingBox>) :
                status === "rejected" ? (<MessageBox variant="danger">{error}</MessageBox>) : 
                (
                 <div>
                    {items.length} Results
                 </div>
                )
            
            }
            </div>
            <div className="row top">
                <div className="col-1">
                    <h3>Department</h3>
                    <ul>
                        <li>Category 1</li>
                    </ul>
                </div>
                <div className="col3">
                    {status === "pending" ? (<LoadingBox>Loading...</LoadingBox>) : 
                        status === "rejected" ? (<MessageBox variant="danger">{error}</MessageBox>) : (
                            <>
                            {items.length === 0 && (<MessageBox>No Product Found</MessageBox>)}
                            <div className="row center">
                                {items.map((product) => (
                                        <Product key={product._id} product={product} />
                                    ))
                                };
                            </div> 
                        </>
                        )

                    }
                </div>
            </div>
        </div>
    )
}

export default SearchScreen
