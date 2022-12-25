import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../features/OrderListSlice';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { deleteOrder, resetDeleteOrder } from '../features/DeleteOrderSlice';

function OrderListScreen() {
    const dispatch = useDispatch();
    const naviate = useNavigate();
    const orderList = useSelector(state => state.orderList);
    const {status, error, orders} = orderList;

    const auth = useSelector(state => state.auth);
    const { userInfo } = auth;
    const sellerMode = window.location.href.indexOf('/seller') >= 0;

    const orderDelete = useSelector(state => state.orderDelete);
    const {status: deletestatus, error: deleteError} = orderDelete;
    const deleteHandler = (order) => {
        if(window.confirm('Are you sure to Delete the Order?')) {
            dispatch(deleteOrder(order._id));
        }
    };

    useEffect(() => {
        dispatch(resetDeleteOrder());
        dispatch(listOrders({ seller: sellerMode ? userInfo._id : '' }));
    }, [dispatch, deletestatus, sellerMode, userInfo._id]);

    return (
        <div>
            <div>
                <h1>Orders</h1>
                {deletestatus === 'pending' && ( <LoadingBox>Deleting...</LoadingBox>)}
                {deletestatus === 'rejected' && (<MessageBox variant="danger">{deleteError}</MessageBox>)}
                {status === 'pending' && ( <LoadingBox>Loading...</LoadingBox>)}
                {status === 'rejected' && (<MessageBox variant="danger">{error}</MessageBox>)}
                <table className='table'>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>USER</td>
                            <td>DATE</td>
                            <td>TOTAL</td>
                            <td>PAID</td>
                            <td>DELIVERED</td>
                            <td>ACTIONS</td>  
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user ? order.user.name : 'No User Info'}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
                                <td>
                                    <button type="button" className='small' 
                                        onClick={() => {naviate(`/order/${order._id}`)}} >
                                            Details
                                        </button>
                                    <button type="button" className='small' 
                                        onClick={() => {deleteHandler(order)}} >
                                            Delete
                                        </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default OrderListScreen
