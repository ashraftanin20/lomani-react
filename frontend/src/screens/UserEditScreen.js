import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsUser } from '../features/ProfileSlice';
import { resetUpdateUser, updateUserData } from '../features/UpdateUserSlice';

function UserEditScreen() {
    const { id } = useParams();
    const[name, setName] = useState('');
    const[email, setEmail] = useState('');
    const[isAdmin, setIsAdmin] = useState(false);
    const[isSeller, setIsSeller] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userProfile);
    const { status, error, user: userData } = userDetails;
    const userUpdate = useSelector(state => state.userUpdate);
    const {status: updateStatus, error: updateError } = userUpdate;

    const submitHandler = (e) => {
        // Implement onSubmit here
        e.preventDefault();
        dispatch(updateUserData({_id: id,
                                    name, email, isAdmin, isSeller})
                );
    }
    useEffect(() => {
        if(updateStatus === 'fulfilled') {
            dispatch(resetUpdateUser());
            navigate('/userlist');
        }
        if (!userData || (userData._id !== id) || updateStatus === 'fulfilled') {
            dispatch(detailsUser(id));
        } else {
            setName(userData.name);
            setEmail(userData.email);
            setIsAdmin(userData.isAdmin);
            setIsSeller(userData.isSeller);
        }
    },[userData, dispatch, id, updateStatus, navigate]);
    return (
        <div>
                  {  updateStatus === "pending" && <LoadingBox>Loading...</LoadingBox> }
                  {  updateStatus === "rejected" && <MessageBox variant="danger">{updateError}</MessageBox> }
            <form className="form" onSubmit={submitHandler} >
                <div>
                    <h1>Edit User</h1>
                </div>
                {status === 'pending' ? (<LoadingBox>Loading...</LoadingBox>) : 
                status === 'rejected' ? (<MessageBox varian="danger">{error}</MessageBox>) :
                <>
                    <div>
                        <label htmlFor='name'>Name</label>
                        <input id='name' type='text' placeholder='Enter Fullname' value={name} 
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input id='email' type='email' placeholder='Enter Email' value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        ></input>
                    </div>
                    <div className='align-left'>
                        <label htmlFor='isAdmin'>Is Admin:</label>
                        <input id='isAdmin' type='checkbox' checked={isAdmin} 
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        ></input>
                    </div>
                    <div className='align-left'>
                        <label htmlFor='isSeller'>Is Seller:</label>
                        <input id='isSeller' type='checkbox' checked={isSeller} 
                            onChange={(e) => setIsSeller(e.target.checked)}
                        ></input>
                    </div>
                    <div>
                        <label></label>
                        <button className='primary' type='submit'>
                            Update User
                        </button>
                    </div>
                </>
                }
            </form>
        </div>
    )
}

export default UserEditScreen;
