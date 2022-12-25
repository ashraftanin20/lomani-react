import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsUser } from '../features/ProfileSlice';
import { updateProfile } from '../features/UpdateProfileSlice';

function ProfileScreen() {

    const auth = useSelector((state) => state.auth);
    const { userInfo } = auth;

    const userProfile = useSelector((state) => state.userProfile);
    const { status, error, user } = userProfile;
    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const { status: updateProfileStatus, error: updateProfileError } = userUpdateProfile;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [sellerLogo, setSellerLogo] = useState('');
    const [sellerDescription, setSellerDescription] = useState('');
    const dispatch = useDispatch();
    
    useEffect(() => {
        if(!user.name || user._id !== userInfo._id) {
            dispatch(detailsUser(userInfo._id));
        } else {
            setName(user.name);
            setEmail(user.email);  
            if(user.isSeller) {
               setSellerName(user.sellerName);
               setSellerLogo(user.sellerLogo);
               setSellerDescription(user.sellerDescription);
            }
        }
        
    }, [dispatch, user, userInfo._id]);

    const submitHandler = (e) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            alert("Password does not match confirm password!");
        } else {
            dispatch(updateProfile({userId: user._id, name:name, email: email, password: password, 
                sellerName: sellerName, sellerLogo: sellerLogo, sellerDescription: sellerDescription}));
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
                                    value={user.name} onChange={(e) => setName(e.target.value)} ></input>
                            </div>
                            <div>
                                <label htmlFor='email'>Email</label>
                                <input id='email' type="email" placeholder='Enter email'
                                    value={user.email} onChange={(e) => setEmail(e.target.value)} ></input>
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
                            {user.isSeller && (
                                <>
                                    <h2>Seller</h2>
                                    <div>
                                        <label htmlFor='sellerName'>Seller Name</label>
                                        <input id='sellerName' type='text' placeholder='Enter Seller Name'
                                            value={user.seller.name} onChange={(e) => setSellerName(e.target.value)} ></input>
                                    </div>
                                    <div>
                                        <label htmlFor='sellerLogo'>Seller Logo</label>
                                        <input id='sellerLog' type='text' placeholder='Enter Seller Logo'
                                            value={user.seller.logo} onChange={(e) => setSellerLogo(e.target.value)} ></input>
                                    </div>
                                    <div>
                                        <label htmlFor='sellerDescription'>Seller Description</label>
                                        <input id='sellerDescription' type='text' placeholder='Enter Seller Description'
                                            value={user.seller.description} onChange={(e) => setSellerDescription(e.target.value)} ></input>
                                    </div>
                                </>
                            )}
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
