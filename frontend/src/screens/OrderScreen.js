
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsOrder } from '../features/OrderDetailsSlice';
import { deliverOrder, resetDeliverOrder } from '../features/DeliverOrderSlice';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { payOrder, resetPayOrder } from '../features/payOrderSlice';

export default function OrderScreen() {
    const { id } = useParams();
    const auth = useSelector(state => state.auth);
    const { userInfo } = auth;
    const dispatch = useDispatch();
    const payOrderData = useSelector(state => state.payOrderData);
    const { status: payStatus, error: payError} = payOrderData;
    const orderDetails = useSelector((state) => state.orderDetails);
    const { orderDetailsError, orderDetailsData, orderDetailsStatus} = orderDetails;

    const orderDeliver = useSelector(state => state.orderDeliver);
    const {status: deliverStatus, error: deliverError } = orderDeliver;

    const deliverHandler = () => {
      dispatch(deliverOrder(orderDetailsData._id));
    }

    const successPaymentHandler = (data) => {
      //TODO implement successpaymenthandler
      dispatch(payOrder({orderDetailsData, data}));

    }
    
      
    useEffect(() => {
    
      if (!orderDetailsData || deliverStatus === 'fulfilled' || payStatus === 'fulfilled' || (orderDetailsData && orderDetailsData._id !== id)) {
        dispatch(resetDeliverOrder());  
        dispatch(resetPayOrder());      
        dispatch(detailsOrder(id));
      } 
    },[dispatch, id, orderDetailsData, deliverStatus, payStatus]);
    
  return (
    <div>
      <div>
        <h1>Order {orderDetailsData._id}</h1>
        {payStatus === "pending" && (<LoadingBox>Loading...</LoadingBox>)}
        {payStatus === "rejected" && (<MessageBox variant="danger">{payError}</MessageBox>)}
        {orderDetailsStatus === "pending" && (<LoadingBox>Loading...</LoadingBox>)}
        {orderDetailsStatus === "rejected" && (<MessageBox variant="danger">{orderDetailsError}</MessageBox>)}
        {deliverStatus === "pending" && (<LoadingBox>Loading...</LoadingBox>)}
        {deliverStatus === "rejected" && (<MessageBox variant="danger">{deliverError}</MessageBox>)}
        {orderDetailsStatus === 'fulfilled' && (
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
                          {!orderDetailsData.isPaid ? (
                             <li>
                          <PayPalButtons 
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [{
                                  description: orderDetailsData.description,
                                  amount: {
                                    value: orderDetailsData.totalPrice,
                                    country: "EUR",
                                  }
                                }]
                              });
                            }}
                            onApprove={async(data, actions) => {
                              const order = await actions.order.capture();
                              console.log("Order: ", order);
                              console.log("PaymentResult:", data);
                              successPaymentHandler(data);
                            }}
                          />
                        </li>
                          )
                        : (
                          <li>
                            Your Order is Paid.
                          </li>                        )
                        }
                        {
                          ( userInfo.isAdmin && orderDetailsData.isPaid && !orderDetailsData.isDelivered) && (
                            <li>
                              <button type='button' onClick={deliverHandler} className='primary block'>
                                Deliver Order
                              </button>
                            </li>
                          )
                        }
                    </ul>
                </div>
            </div>
        </div>
        )}
    </div>
  </div>
)
}