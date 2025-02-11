import React, { useState, useEffect } from 'react';
import { blog } from '../services/api';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await blog.getPosts(page);
      // Ensure posts exist in the response
      const { posts: newPosts = [], currentPage, hasMore } = response.data;
      
      if (page === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...(newPosts || [])]);
      }
      
      setCurrentPage(currentPage);
      setHasMore(hasMore);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(currentPage + 1);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="pt-20 bg-black min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="pt-20 bg-black min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="pt-20 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setSelectedPost(null)}
            className="text-gray-400 hover:text-white mb-6 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to posts
          </button>
          
          <img 
            src={`http://localhost:5000${selectedPost.image}`}
            alt={selectedPost.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
          
          <h1 className="text-4xl font-bold text-white mb-4">{selectedPost.title}</h1>
          <p className="text-gray-400 mb-8">{new Date(selectedPost.date).toLocaleDateString()}</p>
          
          <div className="prose prose-invert max-w-none">
            {selectedPost.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-300 mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Latest Updates</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(posts) && posts.map((post) => (
            <div 
              key={post._id}
              className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <img 
                src={`http://localhost:5000${post.image}`}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-2">
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && posts.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className={`px-6 py-2 text-white rounded-md font-medium ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
              } transition-all duration-300`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}

        {/* No Posts Message */}
        {posts.length === 0 && !loading && (
          <p className="text-center text-gray-400 mt-8">
            No posts available
          </p>
        )}

        {/* No More Posts Message */}
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-gray-400 mt-8">
            No more posts to load
          </p>
        )}
      </div>
    </div>
  );
};

export default Blog; 