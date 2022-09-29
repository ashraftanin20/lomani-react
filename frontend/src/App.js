import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { useDispatch, useSelector } from 'react-redux';
import SigninScreen from './screens/SigninScreen';
import { logoutUser } from './features/authSlice';
import RegisterScreen from './screens/RegisterScreen';

function App() {

  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { userInfo } = auth;

  const signoutHandle = () => {
    dispatch(logoutUser(null));
  }

  return (
    <BrowserRouter>
    <ToastContainer />
    <div className="grid-container">
            <header className="row">
                <div>
                    <Link className="brand" to="/">Lomani</Link>
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
                          <Link to="#signout" onClick={signoutHandle} >Sign Out</Link>
                        </ul>
                      </div>
                      ): (<Link to="/signin">Sign In</Link>)
                    }
                    
                </div>
            </header>
            <main>
            <Routes>
              <Route path='/' element={<HomeScreen />} exact />
              <Route path='/product/:id' element={<ProductScreen />} />
              <Route path="/cart/:id" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/cart/" element={<CartScreen />} />
              
            </Routes>
            </main>
            <footer className="row center">
                All right reserved @lomani 2022
            </footer>
        </div>
        </BrowserRouter>
  );
}

export default App;
