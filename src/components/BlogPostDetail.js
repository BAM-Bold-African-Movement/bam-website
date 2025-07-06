import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { Clock, Eye, Calendar, Share2, BookOpen, ArrowLeft } from 'lucide-react';
import Footer from './Footer';
import blogService from '../services/blogService';

const BlogPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      
      const postData = await blogService.getPost(id);
      setPost(postData);
      
      await blogService.incrementViews(id);
      
      if (postData.authorId) {
        const authorData = await blogService.getAuthorInfo(postData.authorId);
        setAuthor(authorData);
      }
      
      const relatedData = await blogService.getPosts(4);
      setRelatedPosts(relatedData.posts.filter(p => p.id !== id));
      
    } catch (error) {
      console.error('Error loading post:', error);
      setError('Failed to load blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.subtitle || 'Check out this blog post',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/blog');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-white mt-4">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">
            {error ? 'Error Loading Post' : 'Post Not Found'}
          </h2>
          <p className="text-gray-400 mb-6">
            {error || 'The requested blog post could not be found.'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleGoBack}
              className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
            <Link 
              to="/blog" 
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - BAM Blog</title>
        <meta name="description" content={post.subtitle || post.content.substring(0, 160)} />
        <meta name="keywords" content={post.tags?.join(', ') || 'blockchain, cryptocurrency'} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.subtitle || post.content.substring(0, 160)} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gray-900">
        {/* Main Content - Added top padding for navbar */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-yellow-400 hover:text-yellow-300">
                Home
              </Link>
              <span className="text-gray-500">/</span>
              <Link to="/blog" className="text-yellow-400 hover:text-yellow-300">
                Blog
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-400 truncate">{post.title}</span>
            </div>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleGoBack}
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 sm:h-96 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Title and Metadata */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                {post.title}
              </h1>
              
              {post.subtitle && (
                <p className="text-xl text-gray-300 leading-relaxed">
                  {post.subtitle}
                </p>
              )}

              {/* Author and Meta Information */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-700">
                {author && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                      {author.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium">{author.name}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-6 text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{formatDate(post.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{post.readTime || 5} min read</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    <span className="text-sm">{post.views || 0} views</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="blog-content">
              <ReactMarkdown
                components={{
                  h1: ({children}) => <h1 className="text-3xl font-bold text-white mb-6 mt-8">{children}</h1>,
                  h2: ({children}) => <h2 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-bold text-white mb-3 mt-5">{children}</h3>,
                  p: ({children}) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                  ul: ({children}) => <ul className="text-gray-300 mb-4 list-disc list-inside">{children}</ul>,
                  ol: ({children}) => <ol className="text-gray-300 mb-4 list-decimal list-inside">{children}</ol>,
                  li: ({children}) => <li className="mb-2">{children}</li>,
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-gray-300 my-6">
                      {children}
                    </blockquote>
                  ),
                  code: ({inline, children}) => 
                    inline ? (
                      <code className="bg-gray-800 text-yellow-400 px-2 py-1 rounded text-sm">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-gray-800 text-gray-300 p-4 rounded-lg overflow-x-auto">
                        {children}
                      </code>
                    ),
                  pre: ({children}) => (
                    <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg overflow-x-auto mb-6">
                      {children}
                    </pre>
                  ),
                  img: ({src, alt}) => (
                    <div className="my-8">
                      <img src={src} alt={alt} className="w-full rounded-lg" />
                      {alt && <p className="text-center text-gray-400 text-sm mt-2">{alt}</p>}
                    </div>
                  ),
                  a: ({href, children}) => (
                    <a href={href} className="text-yellow-400 hover:text-yellow-300 underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Bottom Action Bar */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleGoBack}
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </button>
                <Link
                  to="/blog"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  View All Posts
                </Link>
              </div>
              
              <button
                onClick={handleShare}
                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Post
              </button>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-8 border-t border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-3" />
                Related Posts
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedPosts.slice(0, 4).map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.id}`}
                    className="block bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                  >
                    {relatedPost.image && (
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.target.src = "/static/img/fallback-blog.jpg";
                        }}
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-white font-bold mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {formatDate(relatedPost.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogPostDetail;