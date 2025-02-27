import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const blogPosts = [
  {
    id: 1,
    title: "Introduction to Blockchain",
    description: "Learn about the fundamentals of blockchain technology and its potential impact on various industries. Discover how this revolutionary technology is changing the future of finance.",
    image: "assests/img/moja1.jpg",
    date: "March 15, 2024",
    link: "/blog/blockchain-intro"
  },
  {
    id: 2,
    title: "Cryptocurrency Trading Strategies",
    description: "Essential tips and strategies for cryptocurrency trading in today's market. Learn how to analyze markets and make informed trading decisions.",
    image: "assests/img/moja1.jpg",
    date: "March 14, 2024",
    link: "/blog/crypto-trading"
  },
  {
    id: 3,
    title: "DeFi Revolution",
    description: "Exploring the world of Decentralized Finance and its growing ecosystem. Understanding the potential of DeFi in reshaping traditional finance.",
    image: "assests/img/mbili2.jpg",
    date: "March 13, 2024",
    link: "/blog/defi-revolution"
  },
  {
    id: 4,
    title: "NFTs and Digital Assets",
    description: "Understanding NFTs and their role in the digital economy. Learn about digital ownership and the future of collectibles.",
    image: "assests/img/mbili2.jpg",
    date: "March 12, 2024",
    link: "/blog/nfts"
  }
];

const Blog = () => {
  return (
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
                Latest Articles
              </h2>
              <div className="flex items-center space-x-4">
                <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700">
                  <option>Most Recent</option>
                  <option>Most Popular</option>
                  <option>Trending</option>
                </select>
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {blogPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image}
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
                      {post.date}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    
                    {/* Read More Link */}
                    <Link 
                      to={post.link}
                      className="inline-block text-yellow-400 hover:text-yellow-300 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Blog; 