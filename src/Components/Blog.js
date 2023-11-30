// Blog.js
import React, { useState } from 'react';
import BlogPostForm from './BlogPostForm';
import '../App.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  const addPost = (newPost) => {
    setPosts([...posts, newPost]);
    // You can also handle storing posts in a database or perform any necessary actions
  };

  return (
    <div className='blog-container'>
      <BlogPostForm onAddPost={addPost} />
      {/* Render blog posts here */}
      {posts.map((post, index) => (
        <div key={index} className='blog-post'>
          <p>{post.content}</p>
          
          {/* Render the image if available */}
          {post.image && (
            <div>
              <img
                src={URL.createObjectURL(post.image)}
                alt="Uploaded"
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
            </div>
          )}
           <p>Date: {post.date}</p>
        </div>
      ))}
    </div>
  );
};

export default Blog;
