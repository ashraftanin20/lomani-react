
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getOrderHistory } from '../features/OrderHistorySlice';

export default function OrderHistoryScreen() {
 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orderHistory = useSelector((state) => state.orderHistory);
    const { orderHistoryError, orderHistoryData, orderHistoryStatus} = orderHistory;

    useEffect(() => {
      dispatch(getOrderHistory(null));
    },[dispatch]);
    
  return orderHistoryStatus === "pending" ? (<LoadingBox>Loading...</LoadingBox>)
        : orderHistoryStatus === "rejected" ? (
        <MessageBox variant="danger">{orderHistoryError}</MessageBox> 
        ) : 
        (
          <table className='table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>IDELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orderHistoryData.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'NO'}</td>
                  <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'NO'}</td>
                  <td><button type='button' className='small'
                    onClick={() => {navigate(`/order/${order._id}`)}}
                  >Details</button>
                  </td>
                </tr>
              ))}
            </tbody>  
          </table>  
        )
}
