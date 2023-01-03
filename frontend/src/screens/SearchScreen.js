import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { productFetch } from '../features/ProductSlice';
import Product from '../components/Product';

function SearchScreen() {
    const { name = 'all', category = 'all'} = useParams();

    const products = useSelector(state => state.products);
    const { items, error, status } = products;

    const productCategories = useSelector(state => state.productCategories);
    const { items: categories, error: errorCategories, status: statusCategories } = productCategories;
    const dispatch = useDispatch();

    
    useEffect(() => {
        dispatch(productFetch({name: name !== 'all' ? name : '',
                                category: category !== 'all' ? category : '',
                            })
                        );
        
    },[category, dispatch, name]);

    const getFilterUrl = (filter) => {
        const filterCategory = filter.category || category;
        const filterName = filter.name || name;
        return `/search/category/${filterCategory}/name/${filterName}`;
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
            </div>
            <div className="row top">
                <div className="col-1">
                    <h3>Department</h3>
                    { statusCategories === "pending" && (<LoadingBox>Loading...</LoadingBox>) }
                      {  statusCategories === "rejected" && (<MessageBox variant="danger">{errorCategories}</MessageBox>)} 
                    {statusCategories === 'fulfilled' && (
                        <ul>
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
