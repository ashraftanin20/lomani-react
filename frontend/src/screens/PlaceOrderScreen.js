import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder, resetOrder } from '../features/OrderSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function PlaceOrderScreen() {
    const cart = useSelector(state => state.cart);

    const navigate = useNavigate();
    const toPrice = (num) => Number(num.toFixed(2));
    const itemsPrice = toPrice(
        cart.cartItems.reduce((a, c) => a + c.cartQty * c.price, 0)
    );
    const shippingPrice = itemsPrice > 100 ? toPrice(0) : toPrice(10);
    const taxPrice = toPrice(0.15 * itemsPrice);
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    const dispatch = useDispatch();
    const orderCreate = useSelector((state) => state.orderCreate);
    const {status: orderCreateStatus, error: orderCreateError, order: orderCreateData} = orderCreate;
    
    
    const placeOrderHandler = (e) => {
        //TODO: dispatch place order action
        //e.preventDefault();
        dispatch(createOrder({...cart, itemsPrice, taxPrice, shippingPrice, totalPrice, cartItems: cart.cartItems}));
    }
    useEffect(() => {
        if(!cart.paymentMethod) {
            navigate('/payment');
        }
        if(orderCreateStatus === "fulfilled") {
            navigate(`/order/${orderCreateData._id}`);
            dispatch(resetOrder());
        }
    },[cart.paymentMethod, navigate, dispatch, orderCreateStatus, orderCreateData]);
  return (
    <div>
        <CheckoutSteps step1 step2 step3 step4 ></CheckoutSteps>
    
        <div className="row top">
            <div className="col-2">
                <ul>
                    <li>
                        <div className="card card-body">
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                                <strong>Address:</strong> {cart.shippingAddress.address},
                                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
                                ,{cart.shippingAddress.country}
                            </p>
                        </div>
                    </li>
                    <li>
                        <div className="card card-body">
                            <h2>Payment</h2>
                            <p><strong>Method:</strong> {cart.paymentMethod}</p>
                        </div>
                    </li>
                    <li>
                        <div className="card card-body">
                            <h2>Order Items</h2>
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
                                        <div>{item.cartQty} x {item.price} = {item.cartQty * item.price}</div>
                                    </div>
                                </li>
                            ))}
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="col-1">
                <div className="card card-body">
                    <ul>
                        <li>
                            <h2>Order Summary</h2>
                        </li>
                        <li>
                            <div className="row">
                                <div>Item</div>
                                <div>${itemsPrice.toFixed(2)}</div>
                            </div>
                        </li>
                        <li>
                            <div className="row">
                                <div>Shipping</div>
                                <div>${shippingPrice.toFixed(2)}</div>
                            </div>
                        </li>
                        <li>
                            <div className="row">
                                <div>Tax</div>
                                <div>${taxPrice.toFixed(2)}</div>
                            </div>
                        </li>
                        <li>
                            <div className="row">
                                <div>
                                    <strong>Order Total</strong>
                                </div>
                                <div><strong>${totalPrice.toFixed(2)}</strong></div>
                            </div>
                        </li>
                        <li>
                            <button type="button" 
                                    onClick={placeOrderHandler} 
                                    className="primary block"
                                    disabled={cart.cartItems.length === 0}
                                    >
                                Place Order
                            </button>
                        </li>
                        {
                            orderCreateStatus === "pending" ?? <LoadingBox></LoadingBox>
                        }
                        { orderCreateStatus === "rejected" ?? <MessageBox variant="danger">{orderCreateError}</MessageBox>}
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}
