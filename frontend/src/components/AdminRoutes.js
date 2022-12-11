import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function AdminRoutes() {
    const auth = useSelector((state) => state.auth);
    const {userInfo } = auth;
    return (
      userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to='/signin' />
    )
}

export default AdminRoutes
