import React, { useState, useEffect,useContext } from "react";
import "../App.css";
import { db,auth } from '../config/firebase';
import { collection, query, where, getDoc, setDoc, serverTimestamp, doc,updateDoc, getDocs,  } from 'firebase/firestore';
import ThemeToggler from "./ThemeToggler"; // Import your ThemeToggler component
import { Link } from "react-router-dom";
import {
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";
import { AuthContext } from "../context/AuthContext";

const Navbar = ({ handleThemeChange, handleDisplayChange, handleDisplayChat }) => {
  const [showThemePopup, setShowThemePopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({name: '', profilePic: ''});

  const [users, setUsers] = useState(null);
  const {currentUser} = useContext(AuthContext);
  // const [username, setUsername] = useState("");

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
            where("displayName", "==", searchQuery)
          );
          const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUsers(doc.data());
      });
          const results = [];
          querySnapshot.forEach((doc) => {
            results.push(doc.data());
          });
    
           // Update users state with search results
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
  const handleAddConnection = async (currentUser, users) => {
    const combinedId =
      currentUser.uid > users.uid
        ? currentUser.uid + users.uid
        : users.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        // Create a chat in the "chats" collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
  
        const currentUserPhotoURL = currentUser.profilepic ? currentUser.profilepic : 'default_profile_pic_url';
      const usersPhotoURL = users.profilepic ? users.profilepic : 'default_profile_pic_url';
        // Create user chats for currentUser
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: users.uid,
            displayName: users.displayName,
            photoURL: usersPhotoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
    
        // Update user chats for users
        await updateDoc(doc(db, "userChats", users.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUserPhotoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      
      console.log("Adding connections between",currentUser.displayName,"And",users.displayName );
    } catch (err) {
      console.log(err)
    }

    setUsers(null);
    // setUsername("");
  };


  return (
    <nav className="navbar">
      <div className="navbar-brand">Collab Hub</div>
      <ul className="navbar-menu">
        <li className="nav-item" onClick={handleDisplayChange}>
          {/* <Link to={'/home'} className="nav-link active" >Home</Link> */}
          <a href="#" className="nav-link active" >Home</a>
        </li>
        <li className="nav-item" onClick={handleDisplayChat}>
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
              onClick={() => handleAddConnection(currentUser,users)}
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