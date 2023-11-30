import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase'; // Import your Firebase db instance or configuration

const Connections = ({ currentUser, refreshConnections }) => {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        if (currentUser) {
          const userConnectionsRef = db.collection('connections').doc(currentUser.uid);
          const doc = await userConnectionsRef.get();

          if (doc.exists) {
            setConnections(doc.data().userConnections || []);
          } else {
            console.log('No connections found for the current user.');
          }
        }
      } catch (error) {
        console.error('Error fetching connections:', error);
      }
    };

    fetchConnections();
  }, [currentUser, refreshConnections]); // Include refreshConnections in the dependency array

  return (
    <div className="connections-container">
      <h2>My Connections</h2>
      <ul className="connections-list">
        {connections.map((connection, index) => (
          <li key={index} className="connection-item">
            {/* Display connection details */}
            <p>Name: {connection.displayName}</p>
            {/* Display other connection details */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Connections;
