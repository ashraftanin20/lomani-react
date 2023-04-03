import React, { useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { productFetch } from '../features/ProductSlice';
import { listTopSellers } from '../features/TopSellerSlice';
import { Link } from 'react-router-dom';


 export default function HomeScreen () {

    const products = useSelector(state => state.products);
    const { items, error, status } = products;
    const dispatch = useDispatch();
    //const latestItems = items.slice(0, 3);

    const topSellerList = useSelector(state => state.topSellerList);
    const {topSellers, status: statusTopSellers, error: errorTopSellers} = topSellerList;

    useEffect(() => {
        dispatch(productFetch({}));
        dispatch(listTopSellers());
    }, [dispatch]);
    return (
        <div>
            <h2>Top Sellers</h2>
            {
            statusTopSellers === "pending" ? (<LoadingBox></LoadingBox>) : 
            statusTopSellers === "rejected" ? (<MessageBox variant="danger">{errorTopSellers}</MessageBox>) : 
            ( 
            <>
                {topSellers.length === 0 && (<MessageBox>No Sellers Found</MessageBox>)}
                <Carousel autoPlay={true} showThumbs={false}>
                    {topSellers.map((seller) => (
                        <div key={seller._id}>
                            <Link to={`/seller/${seller._id}`}>
                                <img src={seller.seller.logo} alt={seller.seller.name} />
                                <p className="legend">{seller.seller.name}</p>
                            </Link>
                        </div>
                    ))}
                        { 
                        //     latestItems.map((item) =>  (
                        //     <div key={item._id}>
                        //         <img className='large' src={item.image} alt={item.name}>
                        //         </img>
                        //     </div>
                        //))}
                    }
                </Carousel>
             </>
            )}
            <h2>Featured Products</h2>
        {
            status === "pending" ? (<LoadingBox></LoadingBox>) : 
            status === "rejected" ? (<MessageBox variant="danger">{error}</MessageBox>) : 
            ( 
                <>
                {items.length === 0 && (<MessageBox>No Sellers Found</MessageBox>)}
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
    )
}

