import React, { useEffect, useState } from "react";
import { auth, db } from '../config/firebase'; // Assuming you have a file './config/firebase' exporting 'auth' and 'db'
import { doc, getDoc } from 'firebase/firestore';
import "../App.css"; // Import your CSS file for styling
const Userprofile = () => {

  const [userDetails, setUserDetails] = useState({ name: '', profilePic: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if there's a logged-in user
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            // User is signed in, retrieve user details
            const userRef = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              // Fetch name and profile pic from userSnapshot data
              const userData = userSnapshot.data();
              const { displayName, profilepic } = userData; // Update with actual field names from Firestore

              // Update state with fetched name and profile pic
              setUserDetails({ name: displayName, profilepic });
              
            } else {
              console.log('No such document!');
            }
          } else {
            // No user is signed in
            console.log('No user signed in');
          }
        });
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="user-profile-container">
      <div className="profile-info">
      <img
          src={userDetails.profilepic || 'default-profile-pic-url'}
          alt="Profile"
          className="profile-picture"
        />
        <h5 className="user-name">{userDetails.name}</h5>
      </div>
      <div className="profile-links">
        <ul className="profile-links-list">
          <li className="profile-link-item">
            <a href="#" className="profile-link">Connections</a>
          </li>
          <li className="profile-link-item">
            <a href="#" className="profile-link">Groups</a>
          </li>
          <li className="profile-link-item">
            <a href="#" className="profile-link">Events</a>
          </li>
          <li className="profile-link-item">
            <a href="#" className="profile-link">Notices</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Userprofile;
