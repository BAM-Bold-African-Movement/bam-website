import React, { useState } from 'react';
import { blog } from '../../services/api';

const BlogPostForm = ({ onPostCreated }) => {
  const initialFormState = {
    title: '',
    excerpt: '',
    content: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    // Excerpt validation
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length < 10) {
      newErrors.excerpt = 'Excerpt must be at least 10 characters long';
    } else if (formData.excerpt.length > 200) {
      newErrors.excerpt = 'Excerpt must be less than 200 characters';
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters long';
    }

    // Image validation
    if (!image) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please upload a valid image file (JPG, PNG, or GIF)'
        }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      alert('Please fix the form errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('excerpt', formData.excerpt.trim());
      formDataToSend.append('content', formData.content.trim());
      formDataToSend.append('image', image);

      const response = await blog.createPost(formDataToSend);
      
      // Reset form
      setFormData(initialFormState);
      setImage(null);
      setImagePreview('');
      setErrors({});
      
      // Notify parent component
      if (onPostCreated) {
        onPostCreated(response.data);
      }

      // Show success message
      alert('Post created successfully!');
      
    } catch (err) {
      console.error('Error creating post:', err);
      const message = err.response?.data?.message || 'Error creating post. Please try again.';
      setSubmitError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Create New Blog Post</h2>
      
      {submitError && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: undefined }));
              }
            }}
            className={`w-full px-3 py-2 border ${
              errors.title ? 'border-red-500' : 'border-gray-700'
            } rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
            placeholder="Enter post title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-1">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            rows="2"
            required
            placeholder="Brief description of the post"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            rows="6"
            required
            placeholder="Write your post content here"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Image</label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className={`block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-gray-800 file:text-white
                hover:file:bg-gray-700
                file:cursor-pointer cursor-pointer
                ${errors.image ? 'border border-red-500 rounded-md' : ''}`}
            />
          </div>
          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image}</p>
          )}
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-auto object-cover rounded-md"
              />
            </div>
          )}
          <p className="mt-1 text-sm text-gray-400">
            Accepted formats: JPG, PNG, GIF (max 5MB)
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
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
                Creating...
              </span>
            ) : (
              'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm; 