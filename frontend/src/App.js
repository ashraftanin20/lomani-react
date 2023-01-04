import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { useDispatch, useSelector } from 'react-redux';
import SigninScreen from './screens/SigninScreen';
import { logoutUser } from './features/authSlice';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivateRoutes from './components/PrivateRoutes';
import AdminRoutes from './components/AdminRoutes';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SellerRoute from './components/SellerRoute';
import SellerScreen from './screens/SellerScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import { listProductCategories } from './features/ProductCategorySlice';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';

function App() {

  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { userInfo } = auth;
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const signoutHandle = () => {
    dispatch(logoutUser(null));
  }

  const productCategories = useSelector(state => state.productCategories);
  const { items: categories, error: errorCategories, status: statusCategories } = productCategories;

  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);

  return (
    <BrowserRouter>
    <ToastContainer />
    <PayPalScriptProvider 
      options={{"client-id": "Ac7IQDngMxh-2-24_GOGMt09VNaOKJgF8dS1JKSKGPPw_WNGLvP75pmaf7TQYLuc4IZit1shBijYHnU4"}}
    >
    <div className="grid-container">
            <header className="row">
                <div>
                    <button type="button" className="open-sidebar" onClick={() => setSidebarIsOpen(true)}>
                      <i className="fa fa-bars"></i>
                    </button>
                    <Link className="brand" to="/">Lomani</Link>
                </div>
                <div>
                  <SearchBox />
                </div>
                <div>
                    <Link to="/cart">Cart</Link>
                    {cart.cartItems.length > 0 && (
                      <span className="badge">{cart.cartItems.length}</span>
                    )}
                    {userInfo ? (
                      <div className="dropdown">
                        <Link to="#">{userInfo.name} <i className="fa fa-caret-down"></i>{' '}
                        </Link>
                        <ul className="dropdown-content">
                          <li><Link to='/orderhistory' >Order History</Link></li>
                          <li><Link to='/userprofile'>MyProfile</Link></li>
                          <li><Link to="/signin" onClick={signoutHandle} >Sign Out</Link></li>
                        </ul>
                      </div>
                      ): (<Link to="/signin">Sign In</Link>)
                    }
                    {userInfo && userInfo.isSeller && (
                        <div className='dropdown'>
                        <Link to='#seller'>
                          Seller <i className='fa fa-caret-down'></i>
                        </Link>
                        <ul className='dropdown-content'>
                          <li>
                            <Link to='/productlist/seller'>Products</Link>
                          </li>
                          <li>
                            <Link to='/orderlist/seller'>Orders</Link>
                          </li>
                        </ul>
                      </div>
                    )}
                    {userInfo && userInfo.isAdmin && (
                      <div className='dropdown'>
                        <Link to='#admin'>
                          Admin <i className='fa fa-caret-down'></i>
                        </Link>
                        <ul className='dropdown-content'>
                          <li>
                            <Link to='/dashboard'>Dashboard</Link>
                          </li>
                          <li>
                            <Link to='/productlist'>Products</Link>
                          </li>
                          <li>
                            <Link to='/orderlist'>Orders</Link>
                          </li>
                          <li>
                            <Link to='/userlist'>Users</Link>
                          </li>
                        </ul>
                      </div>
                    )}
                    
                </div>
            </header>
            <aside className={sidebarIsOpen ? 'open' : ''}>
                      <ul className="categories">
                        <li>
                          <strong>Categories</strong>
                          <button onClick={() => setSidebarIsOpen(false)} 
                            className="close-sidebar"
                            type="button">
                            <i className="fa fa-close"></i>
                          </button>
                        </li>
                        { statusCategories === "pending" && (<LoadingBox>Loading...</LoadingBox>) }
                        {  statusCategories === "rejected" && (<MessageBox variant="danger">{errorCategories}</MessageBox>)} 
                        {statusCategories === 'fulfilled' && (
                          categories.map((c) => (
                            <li key={c}>
                              <Link to={`/search/category/${c}`} onClick={() => setSidebarIsOpen(false)}>
                                {c}
                              </Link>
                            </li>
                          ))
                        )}
                      </ul>
            </aside>
            <main>
            <Routes>
              <Route path='/seller/:id' element={<SellerScreen />} />
              <Route path='/' element={<HomeScreen />} exact />
              <Route path='/product/:id' element={<ProductScreen exact/>} />
              <Route path='/product/:id/edit' element={<ProductEditScreen exact/>} />
              <Route path="/cart/:id" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/cart/" element={<CartScreen />} />
              <Route path='/shipping' element={<ShippingAddressScreen />} />
              <Route path='/payment' element={<PaymentMethodScreen />} />
              <Route path='/placeorder' element={<PlaceOrderScreen />} />
              <Route path='/orderhistory' element={<OrderHistoryScreen />} />
              <Route path='/order/:id' element={<OrderScreen />} />
              <Route path='/search/name/:name' element={<SearchScreen exact/>} />
              <Route path='/search/name/' element={<SearchScreen exact/>} />
              <Route path='/search/category/:category' element={<SearchScreen exact/>} />
              <Route path='/search/category/:category/name/:name' element={<SearchScreen exact/>} />
              <Route path='/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order' element={<SearchScreen exact/>} />
              <Route path='/search/category/:category/name/' element={<SearchScreen exact/>} />
              <Route path='/search/category/:category/name/min/:min/max/:max/rating/:rating/order/:order' element={<SearchScreen exact/>} />
              <Route element={<PrivateRoutes />}>
                <Route path='/userprofile' element={<ProfileScreen />} />
              </Route>
              <Route element={<SellerRoute />}>
                <Route path='/productlist/seller' element={<ProductListScreen exact />} />
              </Route>
              <Route element={<SellerRoute />}>
                <Route path='/orderlist/seller' element={<OrderListScreen exact />} />
              </Route>
              <Route element={<AdminRoutes />}>
                <Route path='/userlist' element={<UserListScreen exact/>} />
              </Route>
              <Route element={<AdminRoutes />}>
                <Route path='/useredit/:id' element={<UserEditScreen exact/>} />
              </Route>
              <Route element={<AdminRoutes />}>
                <Route path='/productlist' element={<ProductListScreen exact/>} />
              </Route>
              <Route element={<AdminRoutes />}>
                <Route path='/orderlist' element={<OrderListScreen exact/>} />
              </Route>
            </Routes>
            </main>
            <footer className="row center">
                All right reserved @lomani 2022
            </footer>
        </div>
        </PayPalScriptProvider>
        </BrowserRouter>
  );
}

export default App;
