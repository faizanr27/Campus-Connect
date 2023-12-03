import React, { useEffect, useState,useContext } from 'react';
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const UserListComponent = () => {
  const [chats, setChats] = useState([]);
  

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
        console.log(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

 

  const handleSelect = (u) => {
    dispatch({type:"CHANGE_USER", payload: u})
  }
  
  return (
    <div>
    <Card>
      <List>
        {Object.entries(chats)
          .sort(([, a], [, b]) => b.date?.seconds - a.date?.seconds)
          .map(([chatId, chat]) => (
            <ListItem variant="rectangular" key={chatId} onClick={()=>handleSelect(chat?.userInfo)}>
              <ListItemPrefix>
                <Avatar
                  variant="circular"
                  alt={chat?.userInfo?.displayName || 'Fallback Alt Text'}
                  src={chat?.userInfo?.photoURL || 'Fallback Image URL'}
                />
              </ListItemPrefix>
              <div>
                <Typography variant="h6" color="blue-gray">
                  {chat?.userInfo?.displayName || 'Fallback User Name'}
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  {chat?.lastMessage?.text || 'No messages'}
                </Typography>
              </div>
            </ListItem>
          ))}
      </List>
    </Card>
    </div>
  );
  
  
  
};

export default UserListComponent;
