import React,{useContext} from 'react';
import { ChatContext } from '../../context/ChatContext';
const UserDetailComponent = () => {

  const { data } = useContext(ChatContext);
  console.log(data);

  const chatRoomName = 'UI/UX Review Check'; // Replace with your chat room name
  const description = 'The place is close to Barceloneta Beach...'; // Replace with your chat room description

  return (
    <div className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
      <div className="relative w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square">
        <img
          src={data?.user?.photoURL || 'Fallback Image URL'}
          alt="card-image"
          className='w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square'
        />
      </div>
      <div className="p-6 flex items-center justify-center">
      <span style={{color:"black"}}>{data?.user?.displayName}</span>
      </div>
    </div>
  );
};

export default UserDetailComponent;
