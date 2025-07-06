import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BlogService from '../../services/blogService';

const BlogPostForm = ({ onPostCreated, editingPost, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState({
    title: editingPost?.title || '',
    content: editingPost?.content || '',
    readMoreLink: editingPost?.readMoreLink || '',
    image: null,
    imagePreview: editingPost?.image || null,
    date: editingPost ? new Date(editingPost.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      setNewPost({
        ...newPost,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!editingPost && !newPost.image) {
      alert('Please select an image');
      return;
    }
    
    setLoading(true);
    
    try {
      const postData = {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        readMoreLink: newPost.readMoreLink.trim(),
        excerpt: newPost.content.trim().substring(0, 150) + '...' // Generate excerpt
      };

      if (editingPost) {
        // Update existing post
        await BlogService.updatePost(editingPost.id, postData, newPost.image);
        alert('Post updated successfully!');
      } else {
        // Create new post
        await BlogService.createPost(postData, newPost.image, user.uid);
        alert('Post created successfully!');
      }
      
      // Reset form
      setNewPost({
        title: '',
        content: '',
        readMoreLink: '',
        image: null,
        imagePreview: null,
        date: new Date().toLocaleDateString()
      });
      
      // Notify parent component
      if (onPostCreated) {
        onPostCreated();
      }
      
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`Error ${editingPost ? 'updating' : 'creating'} post. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewPost({
      title: '',
      content: '',
      readMoreLink: '',
      image: null,
      imagePreview: null,
      date: new Date().toLocaleDateString()
    });
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Post</h2>
      <form onSubmit={handleSubmit}>
        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Featured Image *
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
            {newPost.imagePreview ? (
              <div className="relative">
                <img
                  src={newPost.imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setNewPost({...newPost, image: null, imagePreview: null})}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4 flex text-sm text-gray-400 justify-center">
                  <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-yellow-500 hover:text-yellow-400">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Date - Read Only */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Date
          </label>
          <input
            type="text"
            value={newPost.date}
            readOnly
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
          />
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Title *
          </label>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            placeholder="Enter post title"
            required
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Content *
          </label>
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 h-32"
            placeholder="Enter post content"
            required
          />
        </div>

        {/* Read More Link */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Read More Link
          </label>
          <input
            type="url"
            value={newPost.readMoreLink}
            onChange={(e) => setNewPost({...newPost, readMoreLink: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            placeholder="https://example.com/full-article"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => handleCancel()}
            className="px-4 py-2 text-gray-400 hover:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300 disabled:bg-gray-500"
          >
            {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm; 