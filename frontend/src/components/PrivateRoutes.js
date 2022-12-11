import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function PrivateRoutes() {
    const auth = useSelector((state) => state.auth);
    const {userInfo } = auth;
    return (
      userInfo ? <Outlet /> : <Navigate to='/signin' />
    )
}

export default PrivateRoutes
