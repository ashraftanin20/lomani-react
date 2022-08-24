import React from 'react';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useGetAllProductsQuery } from '../features/ProductsApi';


 export default function HomeScreen () {

    const { data, error, isLoading } = useGetAllProductsQuery();
    return (
        <div>
        { 
            isLoading ? (<LoadingBox></LoadingBox>) : 
            error ? (<MessageBox variant="danger">There was an error featching products.</MessageBox>) : 
            ( 
                <div className="row center">
                    {data.map((product) => (
                            <Product key={product._id} product={product} />
                        ))
                    };
                </div> 
            )
        }
        </div>
    )
}

