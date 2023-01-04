import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { productFetch } from '../features/ProductSlice';
import Product from '../components/Product';
import { prices, ratings } from '../components/utils.js';
import Rating from '../components/Rating';

function SearchScreen() {
    const { name = 'all', category = 'all', min = 0, max = 0, rating = 0, order = 'newest' } = useParams();

    const products = useSelector(state => state.products);
    const { items, error, status } = products;
    const navigate = useNavigate();

    const productCategories = useSelector(state => state.productCategories);
    const { items: categories, error: errorCategories, status: statusCategories } = productCategories;
    const dispatch = useDispatch();

    
    useEffect(() => {
        dispatch(productFetch({name: name !== 'all' ? name : '',
                                category: category !== 'all' ? category : '',
                                min,
                                max,
                                rating,
                                order
                            })
                        );
        
    },[category, dispatch, max, min, name, order, rating]);

    const getFilterUrl = (filter) => {
        const filterCategory = filter.category || category;
        const filterName = filter.name || name;
        const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
        const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
        const filterRating = filter.rating || rating;
        const sortOrder = filter.order || order;

        return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}`;
    }
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
            <div>
                Sort by { ' '}
                <select value={order}
                    onChange={(e) => {
                        navigate(getFilterUrl({order: e.target.value}))
                    }} >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                </select>
            </div>
            </div>
            <div className="row top">
                <div className="col-1">
                    <h3>Department</h3>
                    <div>
                    { statusCategories === "pending" && (<LoadingBox>Loading...</LoadingBox>) }
                      {  statusCategories === "rejected" && (<MessageBox variant="danger">{errorCategories}</MessageBox>)} 
                    {statusCategories === 'fulfilled' && (
                        <ul>
                            <li>
                               <Link
                                    className={'all' === category ? 'active' : ''}
                                    to={getFilterUrl({ category: 'all' })}>Any</Link>
                            </li>
                        {categories.map((c) => (
                            <li key={c}>
                                <Link
                                    className={c === category ? 'active' : ''}
                                    to={getFilterUrl({ category: c })}>{c}</Link>
                            </li>
                        ))}
                        
                    </ul>
                    )}
                    </div>
                    <div>
                        <h3>Price</h3>
                        <ul>
                            {prices.map((p) => (
                                <li key={p.name}>
                                    <Link to={getFilterUrl({min: p.min, max: p.max})}
                                        className={`${p.min}-${p.max}` === `${min}-${max}` ? 'active' : ''}
                                    >
                                        {p.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Avg. Customer Review</h3>
                        <ul>
                            {ratings.map((r) => (
                                <li key={r.name}>
                                    <Link to={getFilterUrl({ rating: r.rating })}
                                        className={r.rating === rating ? 'active' : ''}
                                    >
                                        <Rating caption={' & up'} rating={r.rating}></Rating>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
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
