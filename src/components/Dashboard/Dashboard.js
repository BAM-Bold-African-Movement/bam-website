import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogPostForm from './BlogPostForm';
import BlogPostList from './BlogPostList';
import { blog } from '../../services/api';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await blog.getPosts(1);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
      alert('Error fetching posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPosts();
  }, [navigate, fetchPosts]);

  const handlePostCreated = async (newPost) => {
    try {
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setShowForm(false);
      await fetchPosts();
    } catch (error) {
      console.error('Error handling new post:', error);
      alert('Error updating posts list');
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Blog Dashboard</h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-md hover:from-yellow-500 hover:to-orange-600 transition-colors"
              >
                {showForm ? 'Close Form' : 'Create New Post'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {showForm && (
              <div className="mb-8">
                <BlogPostForm onPostCreated={handlePostCreated} />
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <BlogPostList 
                posts={posts} 
                onPostDeleted={fetchPosts} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 