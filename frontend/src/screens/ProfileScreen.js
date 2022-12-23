import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsUser, resetProfile } from '../features/ProfileSlice';
import { updateProfile } from '../features/UpdateProfileSlice';

function ProfileScreen() {

    const auth = useSelector((state) => state.auth);
    const { userInfo } = auth;

    const userProfile = useSelector((state) => state.userProfile);
    const { status, error, user: profileUser } = userProfile;
    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const { status: updateProfileStatus, error: updateProfileError } = userUpdateProfile;
    const [user, setUser] = useState({
        name: "",
        email: "",
        password:"",
        confirmPassord:""
    });
    const dispatch = useDispatch();
    
    useEffect(() => {
        if(!profileUser.name || profileUser._id !== userInfo._id) {
            dispatch(detailsUser(userInfo._id));
        } else {
            setUser({
                name: profileUser.name || "",
                email: profileUser.email || "",
                password:"",
                confirmPassord:""
            });
        }
        
    }, [dispatch, profileUser]);

    const submitHandler = (e) => {
        e.preventDefault();
        if(user.password !== user.confirmPassord) {
            alert("Password does not match confirm password!");
        } else {
            dispatch(updateProfile({userId: profileUser._id, name:user.name, email: user.email, password: user.password}));
        }

    }
    return (
        <div>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>User Profile</h1>
                </div>
                {
                    status === "pending" ? (
                        <LoadingBox>Loading...</LoadingBox>
                    ) : status === "rejected" ? (
                        <MessageBox variant="danger">{error}</MessageBox>
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
