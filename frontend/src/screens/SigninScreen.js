import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { loginUser } from '../features/authSlice';

export default function SigninScreen() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);

    console.log(auth);

    useEffect(() => {
        if (auth.userInfo){
            navigate("/cart");
        } 
    }, [auth.userInfo, navigate]);

    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    
    const submitHandler = (e) => {
        e.preventDefault();
        //Todo implement signin
        dispatch(loginUser(user));
    }
  return (
    <div>
        <form className="form" onSubmit={submitHandler}>
            <div>
                <h1>Sign In</h1>
            </div>
            {auth.loginStatus === "pending" && <LoadingBox></LoadingBox>}
            {auth.loginStatus === "rejected" && <MessageBox variant="danger">{auth.loginError}</MessageBox>}
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
                <label />
                <button className="primary" type="submit">
                    {auth.loginStatus === "pending" ? "submitting..." : "Sign In"}
                </button>
            </div>
            <div>
                <label />
                <div>
                    New customer? <Link to="/register">Create your account</Link> 
                </div>
            </div>
        </form>
    </div>
  )
}
