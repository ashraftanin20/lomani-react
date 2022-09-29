import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { registerUser } from '../features/authSlice';

export default function RegisterScreen() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        if (auth.userInfo){
            navigate("/cart");
        } 
    }, [auth.userInfo, navigate]);

    const [user, setUser] = useState({
        name:"",
        email: "",
        password: "",
        confirmPassword: "",
    });
    
    const submitHandler = (e) => {
        e.preventDefault();
        //Todo implement register
        if (user.password !== user.confirmPassword) {
            alert("Password does not match the confrim password!");
        } else {
            dispatch(registerUser(user));
        }
    }
        
  return (
    <div>
        <form className="form" onSubmit={submitHandler}>
            <div>
                <h1>Create Account</h1>
            </div>
            {auth.registerStatus === "pending" && <LoadingBox></LoadingBox>}
            {auth.registerStatus === "rejected" && <MessageBox variant="danger">{auth.registerError}</MessageBox>}
            <div>
                <label htmlFor="name">Name</label>
                <input type="text" 
                        id="name"
                        placeholder="Enter name"
                        required
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                    >
                </input> 
            </div>
            <div>
                <label htmlFor="email">Email address</label>
                <input type="email" 
                        id="email"
                        placeholder="Enter email"
                        required
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    >
                </input> 
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" 
                        id="password"
                        placeholder="Enter password"
                        required
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    >
                </input> 
            </div>
            <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" 
                        id="confirmPassword"
                        placeholder="Enter confirm password"
                        required
                        onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                    >
                </input> 
            </div>
            <div>
                <label />
                <button className="primary" type="submit">
                    {auth.registerStatus === "pending" ? "submitting..." : "Register"}
                </button>
            </div>
            <div>
                <label />
                <div>
                    Already have an account? <Link to="/login">{' '}Sing In</Link> 
                </div>
            </div>
        </form>
    </div>
  )
}
