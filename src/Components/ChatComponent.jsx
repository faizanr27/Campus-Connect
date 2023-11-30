import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase'; // Import Firebase instance

const ChatComponent = ({ currentUser, recipientUserId }) => {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const roomId = generateRoomId(currentUser.uid, recipientUserId);
        const messagesRef = db.collection('messages').doc(roomId).collection('messages').orderBy('timestamp');

        const snapshot = await messagesRef.get();
        const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages: ', error);
      }
    };

    fetchMessages();
  }, [currentUser.uid, recipientUserId]);

  const generateRoomId = (userId1, userId2) => {
    // Custom logic to generate a unique room ID based on user IDs
    // You can use any logic to ensure each user pair gets a unique ID for their conversation
    return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
  };

  const sendMessage = async () => {
    try {
      const roomId = generateRoomId(currentUser.uid, recipientUserId);
      const messageRef = db.collection('messages').doc(roomId).collection('messages').doc();

      await messageRef.set({
        content: messageInput,
        senderId: currentUser.uid,
        timestamp: new Date() // Or use Firebase Timestamp
      });

      setMessageInput('');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map(message => (
          <div key={message.id}>
            <p>{message.content}</p>
            {/* Display sender info or timestamp if needed */}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
