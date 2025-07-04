import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogPostForm from './BlogPostForm';
import { useAuth } from '../contexts/AuthContext';
import BlogService from '../services/BlogService';

const Dashboard = () => {
  const { user, userRole, isSuperAdmin, isRegularAdmin, signup, getUserData } = useAuth();
  const [activeSection, setActiveSection] = useState('blog');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // User management states
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteUserConfirm, setShowDeleteUserConfirm] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    status: 'Active'
  });

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  // Load users when switching to user management section
  useEffect(() => {
    if (activeSection === 'users' && isSuperAdmin()) {
      loadUsers();
    }
  }, [activeSection, isSuperAdmin]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      let postsData;
      
      if (isSuperAdmin()) {
        // Super admin can see all posts
        postsData = await BlogService.getAllPosts();
      } else if (isRegularAdmin()) {
        // Regular admin can only see their own posts
        postsData = await BlogService.getPostsByAuthor(user.uid);
      }
      
      setPosts(postsData || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      alert('Error loading posts');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const usersData = await BlogService.getUsersList();
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error loading users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Handle post creation/update
  const handleCreatePost = async (postData) => {
    try {
      if (editingPost) {
        await BlogService.updatePost(editingPost.id, postData, postData.image);
        alert('Post updated successfully!');
      } else {
        await BlogService.createPost(postData, postData.image, user.uid);
        alert('Post created successfully!');
      }
      setShowNewPostForm(false);
      setEditingPost(null);
      loadPosts(); // Reload posts
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`Error ${editingPost ? 'updating' : 'creating'} post`);
    }
  };

  // Handle post deletion
  const handleDelete = async (postId) => {
    try {
      await BlogService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      setShowDeleteConfirm(null);
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  // Handle post editing
  const handleEdit = (post) => {
    setEditingPost(post);
    setShowNewPostForm(true);
  };

  // Handle user form submission
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editingUser && !newUser.password.trim()) {
      alert('Please provide a password for new users');
      return;
    }

    try {
      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.id, {
          name: newUser.name.trim(),
          email: newUser.email.trim(),
          status: newUser.status
        });
        alert('User updated successfully!');
      } else {
        // Create new user
        await signup(newUser.email, newUser.password, newUser.name, newUser.role);
        alert('User created successfully!');
      }
      
      setShowNewUserForm(false);
      setEditingUser(null);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        status: 'Active'
      });
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(`Error ${editingUser ? 'updating' : 'creating'} user: ${error.message}`);
    }
  };

  // Handle user editing
  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status
    });
    setShowNewUserForm(true);
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setShowDeleteUserConfirm(null);
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      await BlogService.updateUser(userId, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      await BlogService.deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 bg-gray-800 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 bg-gray-900">
          <span className="text-xl font-bold text-white">BAM Admin</span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-gray-300 hover:text-white lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <button
            onClick={() => setActiveSection('blog')}
            className={`flex items-center w-full px-4 py-3 rounded-lg mb-2 ${
              activeSection === 'blog' 
                ? 'bg-yellow-500 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Blog Management
          </button>
          
          {/* Only show user management for super admin */}
          {isSuperAdmin() && (
            <button
              onClick={() => setActiveSection('users')}
              className={`flex items-center w-full px-4 py-3 rounded-lg ${
                activeSection === 'users' 
                  ? 'bg-yellow-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              User Management
            </button>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="p-8 pt-24">
          {activeSection === 'blog' ? (
            // Blog Management Section
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Blog Management</h1>
                <button
                  onClick={() => setShowNewPostForm(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                >
                  Create New Post
                </button>
              </div>

              {/* Blog Posts Table */}
              <div className="bg-gray-800 rounded-lg shadow p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {posts.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                            No posts found. Create your first post!
                          </td>
                        </tr>
                      ) : (
                        posts.map((post) => (
                          <tr key={post.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                              <div className="max-w-xs truncate">
                                {post.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                              {formatDate(post.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                              {post.views || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                post.status === 'published' 
                                  ? 'bg-green-900 text-green-200' 
                                  : 'bg-yellow-900 text-yellow-200'
                              }`}>
                                {post.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEdit(post)}
                                className="text-yellow-500 hover:text-yellow-400 mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(post.id)}
                                className="text-red-500 hover:text-red-400"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            // User Management Section (only for super admin)
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">User Management</h1>
              <div className="bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Users</h2>
                  <button 
                    onClick={() => {
                      setEditingUser(null);
                      setNewUser({
                        name: '',
                        email: '',
                        password: '',
                        role: 'admin',
                        status: 'Active'
                      });
                      setShowNewUserForm(true);
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                  >
                    Add New User
                  </button>
                </div>
                
                {usersLoading ? (
                  <div className="text-center text-gray-400 py-8">Loading users...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                              No users found.
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                {user.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                {user.role}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                  onClick={() => handleEditUser(user)}
                                  className="text-yellow-500 hover:text-yellow-400 mr-4"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => setShowDeleteUserConfirm(user.id)}
                                  className="text-red-500 hover:text-red-400"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New/Edit Post Modal */}
      {showNewPostForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <BlogPostForm
              onPostCreated={handleCreatePost}
              editingPost={editingPost}
              onCancel={() => {
                setShowNewPostForm(false);
                setEditingPost(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showNewUserForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleUserSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              {!editingUser && (
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    placeholder="Enter password"
                    required={!editingUser}
                  />
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewUserForm(false);
                    setEditingUser(null);
                    setNewUser({
                      name: '',
                      email: '',
                      password: '',
                      role: 'admin',
                      status: 'Active'
                    });
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                >
                  {editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteUserConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteUserConfirm(null)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteUserConfirm)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;