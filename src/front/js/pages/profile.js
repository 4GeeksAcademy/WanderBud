import React, { useState, useEffect } from 'react';

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null); // Store user profile data
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const token = localStorage.getItem('userToken'); // Replace with your token retrieval logic

        const response = await fetch(process.env.BACKEND_URL + "/api/profile-view", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.results); // Update state with profile data
        } else {
          throw new Error('Error getting public events');
        }
      } catch (error) {
        setErrorMessage(error.message || "Network error, please try again"); // Handle errors
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // Run only once on component mount

  if (isLoading) {
    return <p>Loading user profile...</p>;
  }

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  // Display profile data here
  return (
    <div className="user-profile">
      <h1>{userProfile?.name}</h1> {/* Use optional chaining to handle potential null value */}
      <p>{userProfile?.email}</p>
      {/* Display other profile details, using optional chaining */}
    </div>
  );
}

export default UserProfile;