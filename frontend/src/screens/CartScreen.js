import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import { addToCart, removeFromCart } from '../features/CartSlice';
export default function CartScreen() {
   
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const removeFromCartHandler = (item) => {
      //delete action
      dispatch(removeFromCart(item));
    }

    const checkoutHandler = () => {
      navigate('/shipping');
    }

  return (
    <div className="row top">
      <div className="col-2">
        <h1>Shopping Cart</h1>
        {cart.cartItems.length === 0 ? <MessageBox>
          Cart is empty. <Link to="/">Go Shopping</Link>
        </MessageBox> : (
          <ul>
            {
              cart.cartItems.map((item) => (
                <li key={item.product}>
                  <div className="row">
                    <div>
                      <img className="small"
                            src={item.image}
                            alt={item.name}
                      ></img>
                    </div>
                  <div className="min-30">
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </div>
                  <div>
                    <select value={item.cartQty} 
                            onChange={e => 
                              dispatch(
                                addToCart({product: item, qty: Number(e.target.value), act:"update"})
                              )
                            } 
                      >
                      {[...Array(item.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}> {x + 1}</option>
                          )
                      )}
                    </select>
                  </div>
                  <div>{item.price}</div>
                  <div>
                    <button type="button" onClick={() => removeFromCartHandler(item)}>Remove</button>
                  </div>
                  </div>
                </li>
              )

              )
            }
          </ul>
        )}
      </div>
      <div className="col-1">
        <div className="card card-body">
          <ul>
            <li>
              <h2>
                Subtotal ({cart.cartItems.reduce((a, c) => a + c.cartQty, 0)} items) : 
                          ${cart.cartItems.reduce((a,c) => a + c.price * c.cartQty, 0)}
              </h2>
            </li>
            <li>
              <button type="button" onClick={checkoutHandler} className="primary block" 
                      disabled={cart.cartItems.length === 0}>
                Prodceed to Checkout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
