import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    async function logout() {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.status === 200) {
          setIsLoggedIn(false);
          localStorage.setItem('isLoggedIn', false);
          localStorage.removeItem('userId');
          navigate('/');
        } else {
          // handle error response
        }
      } catch (err) {
        console.error(err);
      }
    }
    logout();
  }, [setIsLoggedIn, navigate]);

  return <div>Logging out...</div>;
}

export default Logout;

