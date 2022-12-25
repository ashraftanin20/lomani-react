import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../features/UserSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { deleteUser } from '../features/DeleteUserSlice';
import { useNavigate } from 'react-router-dom';

function UserListScreen() {

    const usersFetch = useSelector(state => state.usersFetch);
    const { status, error, users} = usersFetch;
    const userDelete = useSelector(state => state.userDelete);
    const {status: deleteStatus, error: deleteError} = userDelete;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const editHandler = (user) => {
        //TODO implment edit user
        navigate(`/useredit/${user._id}`);
    }
    const deleteHandler = (user) => {
        //TODO Implement delete user
        if (window.confirm('Are you sure you want to delete the user ?')) {
            dispatch(deleteUser(user._id));
        }
    }

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch, deleteStatus]);
    return (
        <div>
            <h1>Users</h1>
            {status === 'pending' && (<LoadingBox></LoadingBox>) }
            {status === 'rejected' && (<MessageBox variant="danger">{error}</MessageBox>)}
            {deleteStatus === 'pending' ? (<LoadingBox></LoadingBox>) : 
                deleteStatus === 'rejected' ? (<MessageBox variant="danger">{deleteError}</MessageBox>) : (
                    <table className='table'>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Name</td>
                                <td>Email</td>
                                <td>IS SELLER</td>
                                <td>IS ADMIN</td>
                                <td>ACTIONS</td>
                            </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.isSeller ? 'YES' : 'NO'}</td>
                                        <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                                        <td>
                                            <button type='button' className='small' onClick={() => editHandler(user)} >
                                                EDIT
                                            </button>
                                            <button type='button' className='small' onClick={() => deleteHandler(user)} >
                                                DELETE
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                    </table>
                )
            }
        </div>
    )
}

export default UserListScreen
