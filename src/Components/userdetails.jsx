import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../config/firebase'; // Assuming you have a file './config/firebase' exporting 'auth' and 'db'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import '../App.css';

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newProfilePic, setNewProfilePic] = useState(null);
  // const [editUsername, setEditUsername] = useState(false);
  // const [editProfilePic, setEditProfilePic] = useState(false);
  const [editOptions, setEditOptions] = useState(false); // Added state for the edit options

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
              setUserDetails(userSnapshot.data());
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

  const handleDisplayNameChange = async () => {
    if (newDisplayName.trim() !== '') {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid), { displayName: newDisplayName }, { merge: true });
        setNewDisplayName('');
      } catch (error) {
        console.error('Error updating display name: ', error);
      }
    }
  };

  const handleProfilePicChange = async () => {
    if (newProfilePic) {
      try {
        const storageRef = ref(storage, `${userDetails.displayName}-${Date.now()}`);
        const uploadTask = uploadBytesResumable(storageRef, newProfilePic);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // You can track the upload progress here if needed
          },
          (error) => {
            console.error('Error uploading profile picture:', error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(storageRef);

              // Update user profile with the new photoURL
              await updateProfile(auth.currentUser, {
                photoURL: downloadURL,
              });

              // Update the 'profilepic' field in Firestore
              await setDoc(doc(db, 'users', auth.currentUser.uid), { profilepic: downloadURL }, { merge: true });

              console.log('Profile picture updated successfully!');
            } catch (err) {
              console.error('Error updating profile picture:', err);
            }
          }
        );
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewProfilePic(e.target.files[0]);
    }
  };

  return (
    <div>
      {/* Edit icon for both username and profile picture */}
     <div className="flex flex-col justify-center max-w-xs p-6 shadow-md rounded-xl sm:px-12 dark:bg-gray-900 dark:text-gray-100 mx-auto">
        <div className="flex justify-end mb-4">
          {/* SVG icon */}
          <button onClick={() => setEditOptions(!editOptions)} className="text-blue-500">
          <svg className="h-8 w-8 text-blue-500"  viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg>
          </button>
        </div>

        {/* Username input */}
        {editOptions && (
          <div>
            <div className="flex justify-end mb-4">
              <input
                type="text"
                placeholder="Enter new username"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-40"
              />
              <button
                onClick={handleDisplayNameChange}
                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Update Username
              </button>
            </div>
          </div>
        )}

        {/* Profile picture input */}
        {editOptions && (
          <div>
            <div className="flex justify-end mt-4">
              <input type="file" onChange={handleFileChange} className="hidden" id="file-input" />
              <label
                htmlFor="file-input"
                className="bg-blue-500 text-white px-3 py-1 rounded-md cursor-pointer text-sm hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Choose Profile Picture
              </label>
              <button
                onClick={handleProfilePicChange}
                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Update Profile Picture
              </button>
            </div>
          </div>
        )}
      

      {/* Display user details */}
      {/* <div className="flex flex-col justify-center max-w-xs p-6 shadow-md rounded-xl sm:px-12 dark:bg-gray-900 dark:text-gray-100 mx-auto"> */}
        {/* User details */}
        <img
          src={
            userDetails
              ? userDetails.profilepic || 'default-profile-pic-url' // Replace 'default-profile-pic-url' with your default URL
              : 'default-profile-pic-url'
          }
          alt="Profile"
          className="w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square"
        />
        {userDetails ? (
          <div className="space-y-4 text-center divide-y dark:divide-gray-700">
            <div className="my-2 space-y-1">
              <h2 className="text-xl font-semibold sm:text-2xl">{userDetails.displayName}</h2>
              <p className="px-5 text-xs sm:text-base dark:text-gray-400">{userDetails.email}</p>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
