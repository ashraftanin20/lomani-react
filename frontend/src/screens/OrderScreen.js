import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsOrder } from '../features/OrderDetailsSlice';

export default function OrderScreen() {
    const { id } = useParams();
    const [sdkReady, setSdkReady] = useState(false);
    const dispatch = useDispatch();
    
    const payOrder = useSelector((state) => state.payOrder );
    const { payOrderError, payOrderStatus, payOrderData } = payOrder;
    const orderDetails = useSelector((state) => state.orderDetails);
    const { orderDetailsError, orderDetailsData, orderDetailsStatus} = orderDetails;
    
    const successPaymentHandler = (paymentResult) => {
      //TODO implement successpaymenthandler
      dispatch(payOrder({orderDetailsData, paymentResult}));

    }

    useEffect(() => {
      const addPayPalScript = async () => {
        const { data } = await axios.get('/api/config/paypal');
        const script = document.createElement('script');
        script.type="text/javascript";
        script.src=`https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async=true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
      };
      if (!orderDetailsData || payOrderStatus === 'fulfilled' || (orderDetailsData && orderDetailsData._id !== id)) {
        dispatch(detailsOrder(id));
      } else {
        if (!orderDetailsData.isPaid) {
          if (!window.paypal) {
            addPayPalScript();
          } else {
            setSdkReady(true);
          }
        }
      }
      
    },[dispatch, id, orderDetailsData, sdkReady]);
    
  return orderDetailsStatus === "pending" ? (<LoadingBox>Loading...</LoadingBox>)
        : orderDetailsStatus === "rejected" ? (
        <MessageBox variant="danger">{orderDetailsError}</MessageBox> 
        ) : orderDetailsStatus === "fulfilled" ? (
    <div>
        <h1>Order {orderDetailsData._id}</h1>
        <div className="row top">
            <div className="col-2">
                <ul>
                    <li>
                        <div className="card card-body">
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name:</strong> {orderDetailsData.shippingAddress.fullName} <br />
                                <strong>Address:</strong> {orderDetailsData.shippingAddress.address},
                                {orderDetailsData.shippingAddress.city}, {orderDetailsData.shippingAddress.postalCode}
                                ,{orderDetailsData.shippingAddress.country}
                            </p>
                            {orderDetailsData.isDelivered ? (
                              <MessageBox variant="success">Delivered at: {orderDetailsData.deliveredAt}</MessageBox> )
                              : (
                                <MessageBox variant="danger">Not Delivered</MessageBox>
                              )
                            }
                        </div>
                    </li>
                    <li>
                        <div className="card card-body">
                            <h2>Payment</h2>
                            <p><strong>Method:</strong> {orderDetailsData.paymentMethod}</p>
                            {orderDetailsData.isPaid ? (
                              <MessageBox variant="success">Paid at: {orderDetailsData.paidAt}</MessageBox> )
                              : (
                                <MessageBox variant="danger">Not Paid</MessageBox>
                              )
                            }
                        </div>
                    </li>
                    <li>
                        <div className="card card-body">
                            <h2>Order Items</h2>
                            <ul>
                            {
                            orderDetailsData.orderItems.map((item) => (
                                <li key={item._id}>
                                    <div className="row">
                                        <div>
                                        <img className="small"
                                                src={item.image}
                                                alt={item.name}
                                        ></img>
                                        </div>
                                        <div className="min-30">
                                            <Link to={`/product/${item._id}`}>{item.name}</Link>
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
                                <div>${orderDetailsData.itemsPrice.toFixed(2)}</div>
                            </div>
                        </li>
                        <li>
                            <div className="row">
                                <div>Shipping</div>
                                <div>${orderDetailsData.shippingPrice.toFixed(2)}</div>
                            </div>
                        </li>
                        <li>
                            <div className="row">
                                <div>Tax</div>
                                <div>${orderDetailsData.taxPrice.toFixed(2)}</div>
                            </div>
                        </li>
                        <li>
                            <div className="row">
                                <div>
                                    <strong>Order Total</strong>
                                </div>
                                <div><strong>${orderDetailsData.totalPrice.toFixed(2)}</strong></div>
                            </div>
                        </li>
                        {
                          !orderDetailsData.isPaid && (
                            <li>
                              {!sdkReady ? (<LoadingBox></LoadingBox>) :
                              (
                                <>
                                {payOrderStatus === 'rejected' && (
                                  <MessageBox variant="danger">{payOrderError}</MessageBox>
                                  )}
                                {payOrderStatus === 'pending' && (<LoadingBox></LoadingBox>)}
                                <PayPalButton 
                                  amount={orderDetailsData.totalPrice}
                                  onSuccess={successPaymentHandler}
                                ></PayPalButton>
                                </>
                              )
                              }
                            </li>
                          )
                        }
                    </ul>
                </div>
            </div>
        </div>
    </div>
  ) : (
    <p></p>
  )
}
