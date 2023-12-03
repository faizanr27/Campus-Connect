import React, { useState, useEffect } from "react";
import Navbar from './Navbar';
import Userprofile from "./Userprofile";
import Blog from "./Blog";
import Connections from "./Connections";
import '../App.css';
import UserDetails from "./UserDetails";
import { auth,db } from "../config/firebase";
<<<<<<< Updated upstream
// import FriendList from "./FriendList";
=======
import ContainerComponent from "./Chat/ContainerComponent";
>>>>>>> Stashed changes

const Home = () => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const fetchUserData = () => {
      try {
        // Check if there's a logged-in user
        auth.onAuthStateChanged((user) => {
          if (user) {
            // User is signed in, pass the user object to the setUser function
            setUser(user);
            // console.log(user);
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
  }, [setUser]);


  const [displayUserDetails, setDisplayUserDetails] = useState(false);
  const [displayChat, setDisplayChat] = useState(false);
  const [displaySideBar, setDisplaySideBar] = useState(true);
  
  const [theme, setTheme] = useState('light-theme'); // Default theme is light

  const handleDisplayChange = () => {
    setDisplayChat(false);
    setDisplayUserDetails(false);
    setDisplaySideBar(true);
  }
  const handleDisplayChat = () => {
    setDisplayChat(true);
    setDisplaySideBar(false);
    setDisplayUserDetails(false);
  }
  const handleDisplayUserDetails = () => {
    setDisplayUserDetails(true);
    setDisplayChat(false);
  };
 
 
  const handleThemeChange = (themeClass) => {
    setTheme(themeClass);
  };

  return (
    <div className={`home ${theme}`}>
<<<<<<< Updated upstream
      <Navbar handleThemeChange={handleThemeChange} handleDisplayChange={handleDisplayChange}/>
      <Userprofile handleDisplayUserDetails={handleDisplayUserDetails} />
      <Connections fetchUserData={user}/>
      {/* <FriendList user={user}/> */}
      {!displayUserDetails ? (
        <Blog />
        
      ) : (
        <>
          <UserDetails />
        </>
      )}
=======
      <Navbar handleThemeChange={handleThemeChange} handleDisplayChange={handleDisplayChange} handleDisplayChat={handleDisplayChat} />
      
      <Connections fetchUserData={user}/>
      {displaySideBar && !displayChat && <Userprofile handleDisplayUserDetails={handleDisplayUserDetails} />}
      {!displayChat && !displayUserDetails && <Blog />}
    {!displaySideBar &&!displayUserDetails && <ContainerComponent />}
    {displayUserDetails && <UserDetails />}
      
>>>>>>> Stashed changes
    </div>
  );
};

export default Home;
