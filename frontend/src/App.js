import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { useSelector } from 'react-redux';

function App() {

  const cart = useSelector((state) => state.cart);
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
                    <Link to="/signin">Sign In</Link>
                </div>
            </header>
            <main>
            <Routes>
              <Route path='/' element={<HomeScreen />} exact />
              <Route path='/product/:id' element={<ProductScreen />} />
              <Route path="/cart/:id" element={<CartScreen />} />
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
