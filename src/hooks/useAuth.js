import { useState, useEffect, useCallback } from 'react';
import { signIn, confirmSignIn, signOut, getCurrentUser, fetchUserAttributes } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { Hub } from 'aws-amplify/utils';
import { switchUserPool } from '../config/auth';

export const useAuth = (poolType = 'admin') => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [signInData, setSignInData] = useState(null);
  const navigate = useNavigate();

  const checkAuthState = useCallback(async () => {
    try {
      switchUserPool(poolType);
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      setIsAuthenticated(true);
      setUser({ ...currentUser, attributes });
      console.log('Current user:', currentUser, 'Attributes:', attributes);
      return true;
    } catch (error) {
      console.log("Not authenticated", error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, [poolType]);

  useEffect(() => {
    checkAuthState();

    const listener = Hub.listen('auth', (data) => {
      const { event } = data.payload;
      if (event === 'signedIn') {
        checkAuthState();
      } else if (event === 'signedOut') {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => listener();
  }, [checkAuthState]);

  const handleSignIn = async (email, password) => {
    setError(null);
    try {
      switchUserPool(poolType);
      console.log('Using pool:', poolType);
      
      const signInResult = await signIn({
        username: email,
        password,
      });

      console.log('Sign in result:', signInResult);
      setSignInData(signInResult);

      if (signInResult.isSignedIn) {
        await checkAuthState();
        navigate('/dashboards/default');
      }

      return signInResult;
    } catch (error) {
      console.error('Sign in error:', error);
      if (error.name === 'UserAlreadyAuthenticatedException') {
        const isAuth = await checkAuthState();
        if (isAuth) {
          navigate('/dashboards/default');
          return { isSignedIn: true };
        }
      }
      setError(error.message);
      throw error;
    }
  };

  const completeSignIn = async (newPassword, userAttributes = {}) => {
    setError(null);
    try {
      console.log('Completing sign in with new password and attributes:', userAttributes);
      
      const result = await confirmSignIn({
        challengeResponse: newPassword,
        options: {
          userAttributes
        }
      });

      console.log('Confirm sign in result:', result);

      if (result.isSignedIn) {
        await checkAuthState();
        navigate('/dashboards/default');
      }

      return result;
    } catch (error) {
      console.error('Complete sign in error:', error);
      setError(error.message);
      throw error;
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    signIn: handleSignIn,
    completeSignIn,
    signOut: async () => {
      try {
        switchUserPool(poolType);
        await signOut();
        setIsAuthenticated(false);
        setUser(null);
        navigate('/authentication/sign-in/basic');
      } catch (error) {
        console.error('Sign out error:', error);
        throw error;
      }
    },
    checkAuthState,
  };
};