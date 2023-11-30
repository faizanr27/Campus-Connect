import React, { useEffect, useState } from 'react';
import { auth, db,storage } from '../config/firebase'; // Assuming you have a file './config/firebase' exporting 'auth' and 'db'
import { doc, getDoc,setDoc } from 'firebase/firestore';
import '../App.css'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newProfilePic, setNewProfilePic] = useState(null);

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
  
        uploadTask.on('state_changed', 
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
                photoURL: downloadURL
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
    <div className="user-details bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Account details</h2>
      {userDetails ? (
        <div className="space-y-2">
          <img
            src={userDetails.profilepic || 'default-profile-pic-url'}
            alt="Profile"
            className="profile-picture"
          />
          <p>
            <strong>Username:</strong> {userDetails.displayName}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter new username"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mr-2"
            />
            <button onClick={handleDisplayNameChange} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Update Username
            </button>
          </div>
          <div className="mt-4">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleProfilePicChange} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Update Profile Picture
            </button>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserDetails;
