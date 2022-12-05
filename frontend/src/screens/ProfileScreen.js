import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsUser } from '../features/ProfileSlice';

function ProfileScreen() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassord, setConfirmPassword] = useState('');

    const auth = useSelector((state) => state.auth);
    const { userInfo } = auth;
    const userProfile = useSelector((state) => state.userProfile);

    const { userDetailData, userDetailStatus, userDetailError } = userProfile;
    const dispatch = useDispatch();
    
    useEffect(() => {
        if(!userDetailData) {
            dispatch(detailsUser(userInfo._id));
        } else {
            setName(userDetailData.name);
            setEmail(userDetailData.email);
        }
        
    }, [dispatch, userInfo._id, userDetailData]);

    const submitHandler = (e) => {
        e.preventDefault();
        if(password !== confirmPassord) {
            alert("Password does not match confirm password!");
        } else {
            // Implement confirm password
        }

    }
    return (
        <div>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>User Profile</h1>
                </div>
                {
                    userDetailStatus === "pending" ? (
                        <LoadingBox>Loading...</LoadingBox>
                    ) : userDetailStatus === "rejected" ? (
                        <MessageBox variant="danger">{userDetailError}</MessageBox>
                    ) : (
                        <>
                            <div>
                                <label htmlFor='name'>Name</label>
                                <input id='name' type="text" placeholder='Enter name'
                                    value={name} onChange={(e) => setName(e.target.value)} ></input>
                            </div>
                            <div>
                                <label htmlFor='email'>Email</label>
                                <input id='email' type="email" placeholder='Enter email'
                                    value={email} onChange={(e) => setEmail(e.target.value)} ></input>
                            </div>
                            <div>
                                <label htmlFor='password'>Password</label>
                                <input id='password' type="password" placeholder='Enter password'
                                   onChange={(e) => setPassword(e.target.value)} ></input>
                            </div>
                            <div>
                                <label htmlFor='confirmPassord'>Confirm Password</label>
                                <input id='confirmPassowrd' type="password" placeholder='Enter confirm password'
                                    onChange={(e) => setConfirmPassword(e.target.value)} ></input>
                            </div>
                            <div>
                                <label/>
                                <button className='primary' type='submit'>Update</button>
                            </div>
                        </>
                    )
                }
            </form>
        </div>
    )
}

export default ProfileScreen
