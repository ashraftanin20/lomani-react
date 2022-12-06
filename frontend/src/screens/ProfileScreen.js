import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsUser, resetProfileUpdate, updateProfile } from '../features/ProfileSlice';

function ProfileScreen() {

    const auth = useSelector((state) => state.auth);
    const { userInfo } = auth;
    const userProfile = useSelector((state) => state.userProfile);

    const { userDetailData, userDetailStatus, userDetailError, updateProfileStatus, 
            updateProfileError } = userProfile;
    const [user, setUser] = useState({
        name: userDetailData.name || "",
        email: userDetailData.email || "",
        password:"",
        confirmPassord:""
    });
    const dispatch = useDispatch();
    
    useEffect(() => {
        if(!userDetailData) {
            dispatch(resetProfileUpdate());
            dispatch(detailsUser(userInfo._id));
        } 
        
    }, [dispatch, userInfo._id, userDetailData, user]);

    const submitHandler = (e) => {
        e.preventDefault();
        if(user.password !== user.confirmPassord) {
            alert("Password does not match confirm password!");
        } else {
            dispatch(updateProfile({userId: userDetailData._id, name:user.name, email: user.email, password: user.password}));
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
                            {updateProfileStatus === "pending" && (<LoadingBox>Updating...</LoadingBox>)}
                            {updateProfileStatus === "rejected" && (<MessageBox variant="danger">{updateProfileError}</MessageBox>)}
                            {updateProfileStatus === "fulfilled" && (
                                <MessageBox variant="success">Profile Updated Successfully</MessageBox>
                            )}
                            <div>
                                <label htmlFor='name'>Name</label>
                                <input id='name' type="text" placeholder='Enter name'
                                    value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} ></input>
                            </div>
                            <div>
                                <label htmlFor='email'>Email</label>
                                <input id='email' type="email" placeholder='Enter email'
                                    value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} ></input>
                            </div>
                            <div>
                                <label htmlFor='password'>Password</label>
                                <input id='password' type="password" placeholder='Enter password'
                                   onChange={(e) => setUser({...user, password: e.target.value})} ></input>
                            </div>
                            <div>
                                <label htmlFor='confirmPassord'>Confirm Password</label>
                                <input id='confirmPassowrd' type="password" placeholder='Enter confirm password'
                                    onChange={(e) => setUser({...user, confirmPassord: e.target.value})} ></input>
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
