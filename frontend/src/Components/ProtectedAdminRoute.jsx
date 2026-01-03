import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const ProtectedAdminRoute = ({ children }) => {
  const { UserInfo, setUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      // Check if user is logged in
      if (!localStorage.getItem('isLoggedIn') || !localStorage.getItem('token')) {
        toast.error('You must be logged in to access the admin panel');
        navigate('/');
        setIsVerifying(false);
        return;
      }

      try {
        // Verify admin status directly from backend
        const userId = localStorage.getItem('id');
        if (!userId) {
          toast.error('Session expired. Please login again.');
          navigate('/');
          setIsVerifying(false);
          return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch(API_ENDPOINTS.GET_USER_BY_ID(userId), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = await response.json();
        
        if (!userData?.data) {
          toast.error('Unable to verify user. Please login again.');
          navigate('/');
          setIsVerifying(false);
          return;
        }

        // Update UserInfo with latest data
        if (setUserInfo) {
          setUserInfo(userData.data);
        }

        // Check admin status from backend response
        if (!userData.data.isAdmin) {
          toast.error('Access denied. Admin privileges required.');
          navigate('/');
          setIsVerifying(false);
          return;
        }

        // User is verified admin
        setIsVerifying(false);
      } catch (error) {
        console.error('Error verifying admin access:', error);
        toast.error('Error verifying access. Please try again.');
        navigate('/');
        setIsVerifying(false);
      }
    };

    verifyAdminAccess();
  }, [navigate, setUserInfo]);

  // Show nothing while verifying
  if (isVerifying) {
    return null;
  }

  // Don't render children if user is not admin
  if (!localStorage.getItem('isLoggedIn')) {
    return null;
  }

  if (!UserInfo || !UserInfo.isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;

