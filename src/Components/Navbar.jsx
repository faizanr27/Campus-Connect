import React, { useState, useEffect } from "react";
import "../App.css";
import { db,auth } from '../config/firebase';
import { collection, query, where, getDocs, setDoc, serverTimestamp, doc  } from 'firebase/firestore';
import ThemeToggler from "./ThemeToggler"; // Import your ThemeToggler component
import { Link } from "react-router-dom";
import Home from "./Home";
import {
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";

const Navbar = ({ handleThemeChange, handleDisplayChange }) => {
  const [showThemePopup, setShowThemePopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({name: '', profilePic: ''});
  const [connections, setConnections] = useState([]);
  const [refreshConnections, setRefreshConnections] = useState(false);

  const toggleThemePopup = () => {
    setShowThemePopup(!showThemePopup);
  };

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim() !== '') {
        try {
          const usersRef = collection(db, 'users');
          const q = query(
            usersRef,
            where('displayName', '>=', searchQuery),
            where('displayName', '<=', searchQuery + '\uf8ff')
          );
          const querySnapshot = await getDocs(q);

          const results = [];
          querySnapshot.forEach((doc) => {
            results.push(doc.data());
          });

          setSearchResults(results);
        } catch (error) {
          console.error('Error searching users:', error);
        }
      } else {
        setSearchResults([]);
      }
    };

    searchUsers();
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleViewProfile = (displayName) => {
    // Handle viewing profile logic here
    console.log(`View profile of ${displayName}`);
    // Implement logic to navigate to the user's profile or perform an action related to viewing the profile
  };
  const handleAddConnection = async (otherUser) => {
    try {
      const currentUser = auth.currentUser; // Get the current authenticated user
  
      if (!currentUser) {
        console.error('User not authenticated.');
        return;
      }
  
      const connectionsRef = collection(db, 'connections'); // Ensure 'connections' is a valid collection path in your Firestore
  
      const connectionId = getCombinedUserId(currentUser.uid, otherUser.uid); // Function to create a unique ID for the connection
  
      const connectionDocRef = doc(connectionsRef, connectionId);
  
      const connectionData = {
        users: [currentUser.uid, otherUser.uid], // Store user IDs in an array
        userNames: [currentUser.displayName, otherUser.displayName], // Store user display names in an array
        createdAt: serverTimestamp()
      };
  
      await setDoc(connectionDocRef, connectionData);
  
      console.log(`Added connection between ${currentUser.displayName} and ${otherUser.displayName}`);
    } catch (error) {
      console.error('Error adding connection:', error);
    }
  };
  
  // Function to create a combined user ID for the connection
  const getCombinedUserId = (userId1, userId2) => {
    // Sort user IDs to create a consistent combined ID
    const sortedUserIds = [userId1, userId2].sort();
    return `${sortedUserIds[0]}_${sortedUserIds[1]}`;
  };


  return (
    <nav className="navbar">
      <div className="navbar-brand">Collab Hub</div>
      <ul className="navbar-menu">
        <li className="nav-item" onClick={handleDisplayChange}>
          <Link to={'/home'} className="nav-link active" >Home</Link>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link">Messages</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={toggleThemePopup}>
            Theme
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link">Profile</a>
        </li>
      </ul>
      <div className="rounded-md">
      <form className="search-form">
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </form>
      {/* Display search results */}
      {searchResults.length > 0 && (
  <div className="mt-2 ml-[-140px] absolute top-full z-20">
    {searchResults.map((user, index) => (
      <Card key={index} className="mb-2">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar
              variant="circular"
              alt={user.displayName}
              src={user.profilepic || 'default-profile-pic-url'}
              className="w-10 h-10"
            />
            <div>
              <Typography variant="h6" color="black">
                {user.displayName}
              </Typography>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => handleAddConnection(user)}
              className="px-2 py-1 bg-blue-500 text-white rounded ml-2"
            >
              Add Connection
            </button>
          </div>
        </div>
      </Card>
    ))}
  </div>
)}


</div>
      {showThemePopup && (
        <div className="theme-popup">
          <div className="theme-popup-content">
            <ThemeToggler handleThemeChange={handleThemeChange} />
            <button onClick={toggleThemePopup} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;