import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import axios from 'axios';

export const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [refreshedUser, setRefreshedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get('/profile', { withCredentials: true });
        if (data) {
          setRefreshedUser(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Use refreshed user data if available, fall back to context user
  const displayUser = refreshedUser || user;

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true }); // Call the logout endpoint
      localStorage.removeItem('token'); // Remove the token from localStorage
      setUser(null); // Clear user context
      window.location.href = '/'; // Redirect to home or another page after logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='container py-56'>
      <h1>Dashboard</h1>
      {!!displayUser && (
        <>
          <h2>Hi {displayUser.name}!</h2>
          {displayUser.points > 0 ? (
            <p>Your Points: {displayUser.points}</p>
          ) : (
            <p>No points yet 😢. Start earning points by answering some trivia!</p>
          )}
        </>
      )}
      <button onClick={handleLogout} className="mt-4 p-2 bg-red-600 text-white rounded-md">
        Logout
      </button>
    </div>
  );
}; 