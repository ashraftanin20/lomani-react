import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsOrder } from '../features/OrderDetailsSlice';

export default function OrderScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();
    
    const orderDetails = useSelector((state) => state.orderDetails);
    const { orderDetailsError, orderDetailsData, orderDetailsStatus} = orderDetails;
    useEffect(() => {
      dispatch(detailsOrder(id));
    },[dispatch, id]);
    
    
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
                        </div>
                    </li>
                    <li>
                        <div className="card card-body">
                            <h2>Payment</h2>
                            <p><strong>Method:</strong> {orderDetailsData.paymentMethod}</p>
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
                    </ul>
                </div>
            </div>
        </div>
    </div>
  ) : (
    <p></p>
  )
}