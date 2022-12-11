import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { addToCart } from '../features/CartSlice';
import { fetchProductDetails } from '../features/ProductDetailsSlice';

export default function ProductScreen() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const productDetails = useSelector(state => state.productDetails);
    const { product, error, status } = productDetails;
    const [qty, setQty] = useState(1);
    //const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchProductDetails(id));
    }, [dispatch, id, qty]);

    const addToCartHandler = () => {
        dispatch(addToCart({product: product, qty: qty, act: "add"}));
        //navigate(`/cart/${id}?qty=${qty}`);
        //history.push("/cart");
    }
        return (
            <div>
            { 
                status === "pending" ? (<LoadingBox>Loading...</LoadingBox>) : 
                 status === "rejected" ? (<MessageBox variant="danger">{error}</MessageBox>) : 
                ( 
                    <div>
                <Link to="/">Back to Products</Link>
                <div className="row top">
                    <div className="col-2">
                        <img className="large" src={product.image} alt={product.name} />
                    </div>
                    <div className="col-1">
                        <ul>
                            <li>
                                <h1>{product.name}</h1>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <Rating
                                    rating={product.rating}
                                    numReviews={product.numReviews} 
                                ></Rating>
                            </li>
                            <li>
                                Price: ${product.price} 
                            </li>
                            <li>
                                Description: 
                                <p>{product.description}</p>
                            </li>
                        </ul>
                    </div>
                    <div className="col-1">
                        <div className="card card-body">
                            <ul>
                                <li>
                                    <div className="row">
                                        <div>Price</div>
                                        <div className="price">${product.price}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>Status</div>
                                        <div>
                                            {product.countInStock > 0 ? (
                                                    <span className="success">In Stock</span>
                                                ) : (
                                                    <span className="danger">Unavailable</span>
                                                )
                                            }
                                        </div>
                                    </div>
                                </li>
                                {
                                    product.countInStock > 0 && (
                                        <>
                                        <li className="row">
                                            <div>Qty</div>
                                            <div>
                                                <select type="number" value={qty} onChange={e => setQty(parseInt(e.target.value))}>
                                                    {[...Array(product.countInStock).keys()].map((x) => (
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
