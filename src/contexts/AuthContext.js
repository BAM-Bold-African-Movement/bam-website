import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function (for super admin to create admins)
  const signup = async (email, password, name, role = 'admin') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with name
      await updateProfile(user, { displayName: name });
      
      // Save additional user data to Firestore
      await setDoc(doc(db, 'user', user.uid), { // Changed from 'users' to 'user'
        uid: user.uid,
        email: user.email,
        name: name,
        role: role,
        status: 'Active',
        createdAt: new Date().toISOString()
      });
      
      return user;
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }
  };

  // Sign in function
  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error in signin:', error);
      throw error;
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  };

  // Get user role and data
  const getUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'user', uid)); // Changed from 'users' to 'user'
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  // Check if user is admin (includes super admin)
  const isAdmin = (role = userRole) => {
    return role === 'admin' || role === 'super_admin';
  };

  // Check if user is super admin
  const isSuperAdmin = (role = userRole) => {
    return role === 'super_admin';
  };

  // Check if user is regular admin
  const isRegularAdmin = (role = userRole) => {
    return role === 'admin';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User found' : 'No user');
      
      if (user) {
        try {
          // Get user data and role
          const userData = await getUserData(user.uid);
         // console.log('User data:', userData);
          
          if (userData) {
            // Check if user has admin role
            if (isAdmin(userData.role)) {
              console.log('User is admin, setting user state');
              setUser(user);
              setUserRole(userData.role);
            } else {
              console.log('User is not admin, signing out');
              await signOut(auth);
              setUser(null);
              setUserRole(null);
            }
          } else {
            console.log('No user data found in Firestore');
            // Don't immediately sign out - could be a new user or network issue
            // Instead, set user but with null role, let the app handle it
            setUser(user);
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          // On error, don't sign out immediately, let the app handle it
          setUser(user);
          setUserRole(null);
        }
      } else {
        console.log('No user, clearing state');
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userRole,
    signup,
    signin,
    logout,
    loading,
    isAdmin: () => isAdmin(userRole),
    isSuperAdmin: () => isSuperAdmin(userRole),
    isRegularAdmin: () => isRegularAdmin(userRole),
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};