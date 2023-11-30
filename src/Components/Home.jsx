import React, { useState } from "react";
import Navbar from './Navbar';
import Userprofile from "./Userprofile";
import Blog from "./Blog";
import Connections from "./Connections";
import '../App.css';
import ThemeToggler from "./ThemeToggler";
// import UserDetails from "./userdetails";

const Home = () => {
  const connections = [
    { name: "Connection 1" },
    { name: "Connection 2" },
    { name: "Connection 3" },
    // ... other connections
  ];

  const [theme, setTheme] = useState('light-theme'); // Default theme is light

  const handleThemeChange = (themeClass) => {
    setTheme(themeClass);
  };

  return (
    <div className={`home ${theme}`}>
      <Navbar handleThemeChange={handleThemeChange} />
      <Userprofile />
      <Blog />
      <Connections connections={connections} />
      <ThemeToggler handleThemeChange={handleThemeChange} />
      {/* <UserDetails /> */}
    </div>
  );
};

export default Home;
