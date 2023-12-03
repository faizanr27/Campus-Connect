// BlogPostForm.js
import React, { useState } from 'react';
import '../App.css';
import { Textarea, Button, IconButton } from "@material-tailwind/react";
import { LinkIcon } from "@heroicons/react/24/outline";

const BlogPostForm = ({ onAddPost }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);


  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new FormData object to handle file uploads
    const newPost = {
      content,
      image,
      date: new Date().toISOString(),
    };

    // Call the onAddPost function passed from the parent component to add the new post
    onAddPost(newPost);

    // Clear form fields after submission
    setContent('');
    setImage(null);
  };
  return (

    <div className="home blog-container form-container mb-4">
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex w-full flex-row items-center gap-2 rounded-[99px] border border-gray-900/10 bg-gray-900/5 p-2">
        <div className="flex">
          <IconButton variant="text" className="rounded-full">
            <label htmlFor="imageUpload" className="rounded-full cursor-pointer">
              <input
                type="file"
                id="imageUpload"
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </label>
          </IconButton>
        </div>
        <Textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          placeholder="Enter blog content"
          required
          rows={1}
          resize={true}
          className="outline-none min-h-full !border-0 focus:border-transparent"
          containerProps={{
            className: "grid h-full outline-none",
          }}
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
        <div>
          <IconButton variant="text" className="rounded-full">
            <button type="submit">Post</button>
          </IconButton>
        </div>
      </div>
    </form>
  </div>
  
  );
};

export default BlogPostForm;
