import React, { useState, useEffect } from "react";
import "../App.css";
import { db } from '../config/firebase';
import { collection, query, where, getDocs, setDoc, serverTimestamp, doc  } from 'firebase/firestore';
import ThemeToggler from "./ThemeToggler"; // Import your ThemeToggler component

const Navbar = ({ handleThemeChange }) => {
  const [showThemePopup, setShowThemePopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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
  // const handleAddConnection = async (user) => {
    const handleAddConnection = async (user) => {
      try {
        // Add connection to Firestore
        const connectionsRef = collection(db, 'connections'); // Ensure 'connections' is a valid collection path in your Firestore
        await setDoc(doc(connectionsRef, user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          createdAt: serverTimestamp()
        });
    
        // Update local connections state to reflect the added connection
        const updatedConnections = [...connections, { id: user.uid, displayName: user.displayName }];
        setConnections(updatedConnections);
    
        console.log(`Added connection with ${user.displayName}`);
      } catch (error) {
        console.error('Error adding connection:', error);
      }
    };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Collab Hub</div>
      <ul className="navbar-menu">
        <li className="nav-item">
          <a href="#" className="nav-link active">Home</a>
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
      <form className="search-form">
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {/* <button className="search-button" type="submit">
          Search
        </button> */}
      </form>
      {/* Display search results */}
      {searchResults.length > 0 && (
        <div className="mt-4">
        <ul className="border border-gray-300 rounded-md shadow-md">
          {searchResults.map((user, index) => (
            <li
              key={index}
              className="p-3 flex items-center justify-between hover:bg-gray-100"
            >
              <span>{user.displayName}</span>
              <button
                onClick={() => handleAddConnection(user)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add Connection
              </button>
            </li>
          ))}
        </ul>
      </div>
      )}
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
