import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { addToCart } from '../features/CartSlice';
import { fetchProductDetails } from '../features/ProductDetailsSlice';
import { useGetProductDetailsQuery } from '../features/ProductsApi';

export default function ProductScreen() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { data, error, isLoading } = useGetProductDetailsQuery(id);
    const [qty, setQty] = useState(1);
    //const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchProductDetails(id));
    }, [dispatch, id, qty]);

    const addToCartHandler = () => {
        dispatch(addToCart({product: data, qty: qty, act: "add"}));
        //navigate(`/cart/${id}?qty=${qty}`);
        //history.push("/cart");
    }
        return (
            <div>
            { 
                isLoading ? (<LoadingBox></LoadingBox>) : 
                 error ? (<MessageBox variant="danger">Problem loading product details.</MessageBox>) : 
                ( 
                    <div>
                <Link to="/">Back to Products</Link>
                <div className="row top">
                    <div className="col-2">
                        <img className="large" src={data.image} alt={data.name} />
                    </div>
                    <div className="col-1">
                        <ul>
                            <li>
                                <h1>{data.name}</h1>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <Rating
                                    rating={data.rating}
                                    numReviews={data.numReviews} 
                                ></Rating>
                            </li>
                            <li>
                                Price: ${data.price} 
                            </li>
                            <li>
                                Description: 
                                <p>{data.description}</p>
                            </li>
                        </ul>
                    </div>
                    <div className="col-1">
                        <div className="card card-body">
                            <ul>
                                <li>
                                    <div className="row">
                                        <div>Price</div>
                                        <div className="price">${data.price}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>Status</div>
                                        <div>
                                            {data.countInStock > 0 ? (
                                                    <span className="success">In Stock</span>
                                                ) : (
                                                    <span className="danger">Unavailable</span>
                                                )
                                            }
                                        </div>
                                    </div>
                                </li>
                                {
                                    data.countInStock > 0 && (
                                        <>
                                        <li className="row">
                                            <div>Qty</div>
                                            <div>
                                                <select type="number" value={qty} onChange={e => setQty(parseInt(e.target.value))}>
                                                    {[...Array(data.countInStock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}> {x + 1}</option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        </li>
                                        <li>
                                            <button onClick={addToCartHandler} className="primary block">Add to Cart</button>
                                        </li>
                                        </>
                                    )
                                }
                                
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
                )
            }
            </div>
            
        )
}
