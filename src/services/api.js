// Blog-related API endpoints
export const blog = {
  createPost: async (formData) => {
    // This is a mock implementation. Replace with actual API call when backend is ready
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: Date.now(),
            ...Object.fromEntries(formData.entries()),
            date: new Date().toLocaleDateString(),
            views: 0,
            status: 'Draft'
          }
        });
      }, 500);
    });
  },

  deletePost: async (postId) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },

  updatePost: async (postId, formData) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: postId,
            ...Object.fromEntries(formData.entries()),
            date: new Date().toLocaleDateString()
          }
        });
      }, 500);
    });
  }
}; 