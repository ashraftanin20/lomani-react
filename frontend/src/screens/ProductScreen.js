import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { addToCart } from '../features/CartSlice';
import { fetchProductDetails } from '../features/ProductDetailsSlice';
import { createReview, resetCreateReview } from '../features/ReviewSlice';

export default function ProductScreen() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const productDetails = useSelector(state => state.productDetails);
    const { product, error, status } = productDetails;
    const [qty, setQty] = useState(1);

    const createReviewSlice = useSelector(state => state.createReviewSlice);
    const { error: createReviewError, status: crreateReviewStatus } = createReviewSlice;
    //const navigate = useNavigate();

    const auth = useSelector(state => state.auth);
    const { userInfo } = auth;

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        if(comment && rating) {
           dispatch(createReview({id: id, rating, comment, name: userInfo.name }));
        } else {
            alert("Please enter comment and rating");
        }
    }

    useEffect(() => {
        if(crreateReviewStatus === "fulfilled") {
            window.alert("Review created succussfully");
            setRating('');
            setComment('');
            dispatch(resetCreateReview());
        }
        dispatch(fetchProductDetails(id));
    }, [crreateReviewStatus, dispatch, id, qty]);

    const addToCartHandler = () => {
        dispatch(addToCart({product: product, qty: qty, act: "add"}));
    }
        return (
            <div>
            { 
                status === "pending" && (<LoadingBox>Loading...</LoadingBox>)}
                { status === "rejected" && (<MessageBox variant="danger">{error}</MessageBox>)}
                { status === "fulfilled" &&
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
                                    Seller{' '}
                                </li>
                                <li>
                                    <h2>
                                        <Link to={`/seller/${product.seller._id}`} >
                                            {product.seller.seller.name}
                                        </Link> 
                                    </h2>
                                    <Rating 
                                        rating={product.seller.seller.rating} 
                                        numReviews={product.seller.seller.numReviews} >
                                    </Rating>
                                </li>
                                <li></li>
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
                <div>
                    <h2 id="reviews">
                        Reviews
                    </h2>
                    {product.numReviews.length === 0 && (
                        <MessageBox>There is no review</MessageBox>
                    )}
                    <ul>
                        {product.reviews.map((review) => (
                            <li key={review._id}>
                                <strong>{review.name}</strong>
                                <Rating rating={review.rating} caption=" "></Rating>
                                <p>{review.createdAt.substring(0, 10)}</p>
                                <p>{review.comment}</p>
                            </li>
                        ))}
                        <li>
                            {userInfo ? (
                              <form className="form" onSubmit={submitHandler}>
                                <div>
                                    <h2>Write a customer review</h2>
                                </div>
                                <div>
                                    <label htmlFor="rating">Rating</label>
                                    <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
                                        <option value="">Select...</option>
                                        <option value="1">1- Poor</option>
                                        <option value="2">2- Fair</option>
                                        <option value="3">3- Good</option>
                                        <option value="4">4- Very good</option>
                                        <option value="5">5- Excelent</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="comment">Comment</label>
                                    <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                                </div>
                                <div>
                                    <label></label>
                                    <button className="primary" type="submit">Submit</button>
                                </div>
                                <div>
                                    {crreateReviewStatus === "pending" && (<MessageBox variant="message">Loading...</MessageBox>)}
                                    {crreateReviewStatus === "rejected" && (<MessageBox variant="danger">{createReviewError}</MessageBox>)}
                                </div>
                              </form>
                            ) : (
                              <MessageBox>
                                Please <Link to="/signin">Sing In</Link> to write a review.
                              </MessageBox>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
                )
            }
            </div>
            
        )
}
