// BlogPostForm.js
import React, { useState } from 'react';
import '../App.css';

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
    <div className='form-container'>
      <h2>Create a New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            placeholder="Enter blog content"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="image">Upload Image:</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*" // Allow only image files
          />
        </div>
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default BlogPostForm;
