import React from 'react';
import { blog } from '../../services/api';

const BlogPostList = ({ posts = [], onPostDeleted }) => {
  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blog.deletePost(postId);
        if (onPostDeleted) {
          onPostDeleted();
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post. Please try again.');
      }
    }
  };

  if (!Array.isArray(posts)) {
    return (
      <div className="text-center text-gray-400">
        No posts available
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-400">
        No posts yet. Create your first post!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div 
          key={post._id} 
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
        >
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={`http://localhost:5000${post.image}`}
                alt={post.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-300 mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  {post.content.length} characters
                </p>
                <button 
                  className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                >
                  View Full Post →
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogPostList; 