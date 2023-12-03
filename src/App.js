import React, { useState,useContext } from 'react';
import Auth from './pages/Auth';
import SignUp from './pages/SignUp';
import Home from './Components/Home';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'; // Your main app styles
import { AuthContext } from './context/AuthContext';

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/SignUp" />;
    }

    return children
  };
  const [theme, setTheme] = useState('light-theme');

  const handleThemeChange = () => {
    setTheme(prevTheme => (prevTheme === 'light-theme' ? 'dark-theme' : 'light-theme'));
  };
  // const router = createBrowserRouter([
  //   {
  //     path: '/', element: <Auth />
  //   },
  //   { path: '/signup', element: <SignUp /> },
  //   { path: 'home/*', element: <Home handleThemeChange={handleThemeChange}/> },
  // ])
  // return (
  //   <div className={`app ${theme}`}>
  //     <RouterProvider router={router} />
  //     {/* <Home handleThemeChange={handleThemeChange} /> */}
  //   </div>
  // );
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home className={`app ${theme}`} handleThemeChange={handleThemeChange}/>
              </ProtectedRoute>
            }
          />
          <Route path="signin" element={<Auth />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;

// function App() {
//   const { currentUser } = useContext(AuthContext);

//   const ProtectedRoute = ({ children }) => {
//     if (!currentUser) {
//       return <Navigate to="/SignUp" />;
//     }

//     return children
//   };

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/">
//           <Route
//             index
//             element={
//               <ProtectedRoute>
//                 <Home />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="Login" element={<Login />} />
//           <Route path="Register" element={<Register />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }
// export default App;