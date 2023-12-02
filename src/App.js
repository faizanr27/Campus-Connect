import React, { useState } from 'react';
import Auth from './pages/Auth';
import SignUp from './pages/SignUp';
import Home from './Components/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'; // Your main app styles
import Connections from './Components/Connections';

function App() {
  const [theme, setTheme] = useState('light-theme');

  const handleThemeChange = () => {
    setTheme(prevTheme => (prevTheme === 'light-theme' ? 'dark-theme' : 'light-theme'));
  };
  const router = createBrowserRouter([
    {
      path: '/', element: <Auth />
    },
    { path: '/signup', element: <SignUp /> },
    { path: 'home/*', element: <Home handleThemeChange={handleThemeChange}/> },
  ])
  return (
    <div className={`app ${theme}`}>
      <RouterProvider router={router} />
      {/* <Home handleThemeChange={handleThemeChange} /> */}
    </div>
  );
}

export default App;