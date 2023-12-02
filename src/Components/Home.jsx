import React, { useState } from "react";
import Navbar from './Navbar';
import Userprofile from "./Userprofile";
import Blog from "./Blog";
import Connections from "./Connections";
import '../App.css';
import UserDetails from "./UserDetails";

const Home = () => {
  const connections = [
    { name: "Connection 1" },
    { name: "Connection 2" },
    { name: "Connection 3" },
    // ... other connections
  ];

  const [displayUserDetails, setDisplayUserDetails] = useState(false);
  // const [displayBlog, setDisplayBlog] = useState(true);
  
  const [theme, setTheme] = useState('light-theme'); // Default theme is light

  const handleDisplayUserDetails = () => {
    setDisplayUserDetails(true);
  };
  const handleDisplayChange = () => {
    setDisplayUserDetails(false);
  }
 
  const handleThemeChange = (themeClass) => {
    setTheme(themeClass);
  };

  return (
    <div className={`home ${theme}`}>
      <Navbar handleThemeChange={handleThemeChange} handleDisplayChange={handleDisplayChange}/>
      <Userprofile handleDisplayUserDetails={handleDisplayUserDetails} />
      <Connections connections={connections} />
      {!displayUserDetails ? (
        <Blog />
        
      ) : (
        <>
          <UserDetails />
        </>
      )}
    </div>
  );
};

export default Home;
