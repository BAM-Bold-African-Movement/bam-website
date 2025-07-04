import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BlogService from '../services/BlogService';

const BlogPostList = ({ posts = [], onPostDeleted, onPostEdit }) => {
  const { user } = useAuth();
  const [authorInfo, setAuthorInfo] = useState({});
  const [loading, setLoading] = useState(false);

  // Load author information for posts
  useEffect(() => {
    const loadAuthorInfo = async () => {
      const authorIds = [...new Set(posts.map(post => post.authorId))];
      const authorData = {};
      
      for (const authorId of authorIds) {
        if (authorId) {
          const info = await BlogService.getAuthorInfo(authorId);
          authorData[authorId] = info;
        }
      }
      
      setAuthorInfo(authorData);
    };

    if (posts.length > 0) {
      loadAuthorInfo();
    }
  }, [posts]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setLoading(true);
      try {
        await BlogService.deletePost(postId);
        if (onPostDeleted) {
          onPostDeleted();
        }
        alert('Post deleted successfully!');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (post) => {
    if (onPostEdit) {
      onPostEdit(post);
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
          key={post.id} 
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
        >
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={post.image || '/placeholder-image.jpg'}
                alt={post.title}
                className="w-full h-48 md:h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {post.title}
                  </h3>
                  <div className="text-gray-400 text-sm mb-2">
                    <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                    {authorInfo[post.authorId] && (
                      <p>By: {authorInfo[post.authorId].name}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.status === 'published' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-yellow-500 hover:text-yellow-600 transition-colors"
                    disabled={loading}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    disabled={loading}
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
              </div>
              <p className="text-gray-300 mb-4 line-clamp-3">
                {post.content}
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400 space-x-4">
                  <span>{post.views || 0} views</span>
                  <span>{post.content.length} characters</span>
                </div>
                {post.readMoreLink && (
                  <a 
                    href={post.readMoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                  >
                    Read More →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};