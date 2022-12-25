import React, { useEffect } from 'react';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { productFetch } from '../features/ProductSlice';


 export default function HomeScreen () {

    const products = useSelector(state => state.products);
    const { items, error, status } = products;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(productFetch({seller: ''}));
    }, [dispatch]);
    return (
        <div>
        { 
            status === "pending" ? (<LoadingBox></LoadingBox>) : 
            status === "rejected" ? (<MessageBox variant="danger">{error}</MessageBox>) : 
            ( 
                <div className="row center">
                    {items.map((product) => (
                            <Product key={product._id} product={product} />
                        ))
                    };
                </div> 
            )
        }
        </div>
    )
}

