import React from 'react';
import Footer from './Footer';

const Contact = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-gray-800 rounded-lg shadow-lg p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Contact Us
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              We'd love to hear from you! Fill out the form below and we'll get back to you soon.
            </p>
          </div>
          <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 rounded-t-md focus:outline-none focus:ring-[#CA8A04] focus:border-[#CA8A04] focus:z-10 sm:text-sm"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-[#CA8A04] focus:border-[#CA8A04] focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <textarea
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 rounded-b-md focus:outline-none focus:ring-[#CA8A04] focus:border-[#CA8A04] focus:z-10 sm:text-sm"
                  placeholder="Your Message"
                  rows={4}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#CA8A04] hover:bg-[#A16207] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CA8A04]"
              >
                Send Message
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-gray-300 text-sm">
            Or email us at <a href="mailto:info@bam.com" className="text-[#CA8A04] underline">info@bam.com</a>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-2">Contact Information</h3>
            <p className="text-gray-300 mb-1"><span className="font-semibold">Address:</span> 123 BAM Street, Tech City, Africa</p>
            <p className="text-gray-300 mb-1"><span className="font-semibold">Phone:</span> <a href="tel: +255625313162" className="text-[#CA8A04] underline"> +255625313162</a></p>
            <p className="text-gray-300"><span className="font-semibold">Email:</span> <a href="mailto:info@bam.com" className="text-[#CA8A04] underline">info@bam.com</a></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact; 