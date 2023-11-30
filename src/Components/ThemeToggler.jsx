import React from 'react';
import '../App.css'; // Import your ThemeToggler styles

const ThemeToggler = ({ handleThemeChange }) => {
  const changeTheme = () => {
    handleThemeChange((prevTheme) => (prevTheme === "light-theme" ? "dark-theme" : "light-theme"));
  };
  return (
    // <div className="theme-toggler">
    //   <input
    //     type="checkbox"
    //     id="theme-switch-checkbox"
    //     onChange={handleThemeChange}
    //     className="theme-switch-input"
    //   />
    //   <label htmlFor="theme-switch-checkbox" className="theme-switch-label">
    //     <span className="slider round"></span>
    //   </label>
    //   <p>Current Theme: Light</p>
    // </div>
    <div className="theme-toggler">
      <button onClick={changeTheme}>Change Theme</button>
    </div>
  );
};

export default ThemeToggler;
