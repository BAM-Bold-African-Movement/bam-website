import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from './Footer';
import blogService from '../services/blogService';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  const POSTS_PER_PAGE = 8;

  useEffect(() => {
    setCanonicalUrl(window.location.origin + '/blog');
  }, []);


  // Initial load
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setPosts([]);
        setLastDoc(null);
      } else {
        setLoadingMore(true);
      }

      const result = await blogService.getPosts(POSTS_PER_PAGE, reset ? null : lastDoc);
      
      if (reset) {
        setPosts(result.posts);
      } else {
        setPosts(prev => [...prev, ...result.posts]);
      }
      
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
      setError('');
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadPosts(false);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    // Note: You'd need to modify the blogService to handle different sorting
    // For now, we'll just reload the posts
    loadPosts(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-white mt-4">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BAM Blog - Latest Insights in Blockchain and Cryptocurrency</title>
        <meta name="description" content="Stay updated with the latest insights in blockchain technology, cryptocurrency trading, and decentralized finance from BAM experts." />
        <meta name="keywords" content="blockchain, cryptocurrency, bitcoin, defi, trading, digital assets, NFT" />
        <meta property="og:title" content="BAM Blog - Blockchain & Crypto Insights" />
        <meta property="og:description" content="Latest insights in blockchain technology and cryptocurrency trading" />
        <meta property="og:type" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        {/* Main Content */}
        <main className="flex-grow">
          {/* Blog Hero Section */}
          <div className="relative bg-black pt-20">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="assests/img/sabini.jpeg"
                alt="Blog Hero"
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.3)' }}
              />
            </div>

            {/* Hero Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="max-w-3xl">
                <h1 className="text-5xl font-bold text-white mb-6">
                  BAM Blog
                </h1>
                <p className="text-xl text-gray-300">
                  Stay updated with the latest insights in blockchain technology, cryptocurrency trading, 
                  and decentralized finance.
                </p>
              </div>
            </div>
          </div>

          {/* Blog Grid Section */}
          <div className="bg-gray-900 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-bold text-white">
                  Latest Articles ({posts.length} posts)
                </h2>
                <div className="flex items-center space-x-4">
                  <select 
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="newest">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="trending">Trending</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-8">
                  {error}
                </div>
              )}

              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-4">No blog posts available yet.</div>
                  <p className="text-gray-500">Check back soon for the latest insights!</p>
                </div>
              ) : (
                <>
                  {/* Blog Posts Grid */}
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {posts.map((post) => (
                      <article 
                        key={post.id} 
                        className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg"
                      >
                        {/* Image */}
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.image || "/static/img/fallback-blog.jpg"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/static/img/fallback-blog.jpg";
                            }}
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="p-6">
                          {/* Date */}
                          <div className="text-sm text-gray-400 mb-3">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                            {post.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-gray-300 mb-4 line-clamp-3">
                            {post.content.substring(0, 150)}...
                          </p>
                          
                          {/* Views and Read More */}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {post.views || 0} views
                            </span>
                            <Link 
                              to={`/blog/${post.id}`}
                              className="inline-block text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                              onClick={() => blogService.incrementViews(post.id)}
                            >
                              Read More →
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center mt-12">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                          loadingMore
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-yellow-500 text-white hover:bg-yellow-600'
                        }`}
                      >
                        {loadingMore ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                          </div>
                        ) : (
                          'Load More Posts'
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Blog;