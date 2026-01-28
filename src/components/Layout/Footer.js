import React from 'react';

const Footer = () => (
  <footer className="w-full bg-gray-900 text-gray-300 py-6 mt-12">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
      <div className="text-sm">&copy; {new Date().getFullYear()} BAM. All rights reserved.</div>
      <div className="flex space-x-4 mt-2 md:mt-0">
        <a href="/" className="hover:text-[#CA8A04] transition-colors">Home</a>
        <a href="/blog" className="hover:text-[#CA8A04] transition-colors">Blog</a>
        <a href="/contact" className="hover:text-[#CA8A04] transition-colors">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer; 