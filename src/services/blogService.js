import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  startAfter,
  where,
  getDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase';

class BlogService {
  constructor() {
    this.collectionName = 'blogPosts';
  }

  // Create a new blog post
  async createPost(postData, imageFile, authorId) {
    try {
        let imageUrl = '';
        
        // Upload image if provided (for backward compatibility)
        if (imageFile) {
            const imageRef = ref(storage, `blog-images/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        // Create post document with author ID - FIXED to match Firestore rules
        const docData = {
            title: postData.title,
            subtitle: postData.subtitle || '',
            content: postData.body, // Changed from 'body' to 'content' to match rules
            tags: postData.tags || [],
            wordCount: postData.wordCount || 0,
            paragraphCount: postData.paragraphCount || 0,
            readTime: postData.readTime || 1,
            authorId: authorId, // Track who created the post
            image: imageUrl || postData.coverImageUrl || '', // Use uploaded image or coverImageUrl from editor
            createdAt: new Date(), // Use Date object, not ISO string
            updatedAt: new Date(), // Use Date object, not ISO string
            views: 0, // Initialize views to 0
            status: postData.status || 'published' // Default to published
        };

        const docRef = await addDoc(collection(db, this.collectionName), docData);
        
        // Return with ISO strings for frontend use
        return { 
            id: docRef.id, 
            ...docData,
            createdAt: docData.createdAt.toISOString(),
            updatedAt: docData.updatedAt.toISOString()
        };
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
  }

  // Get posts with pagination
  async getPosts(limitCount = 10, lastDoc = null) {
    try {
      let q = query(
        collection(db, this.collectionName),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(
          collection(db, this.collectionName),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });

      return {
        posts,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
        hasMore: querySnapshot.docs.length === limitCount
      };
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  }

  // Get all posts for admin (including drafts)
  async getAllPosts() {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });

      return posts;
    } catch (error) {
      console.error('Error getting all posts:', error);
      throw error;
    }
  }

  // Get posts by author (for regular admins to see their own posts)
  async getPostsByAuthor(authorId) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('authorId', '==', authorId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });

      return posts;
    } catch (error) {
      console.error('Error getting posts by author:', error);
      throw error;
    }
  }

  // Get single post by ID
  async getPost(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Post not found');
      }
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  }

  // Update post (with author check handled by security rules)
  async updatePost(id, postData, imageFile = null) {
    try {
        const docRef = doc(db, this.collectionName, id);
        let updateData = {
            title: postData.title,
            subtitle: postData.subtitle || '',
            content: postData.body || postData.content, // Support both field names
            tags: postData.tags || [],
            wordCount: postData.wordCount || 0,
            paragraphCount: postData.paragraphCount || 0,
            readTime: postData.readTime || 1,
            status: postData.status || 'published',
            updatedAt: new Date() // Use Date object, not ISO string
        };

        // Upload new image if provided
        if (imageFile) {
            const imageRef = ref(storage, `blog-images/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            const imageUrl = await getDownloadURL(snapshot.ref);
            updateData.image = imageUrl;
        } else if (postData.coverImageUrl) {
            updateData.image = postData.coverImageUrl;
        }

        // Get current document to preserve authorId and views
        const currentDoc = await getDoc(docRef);
        if (currentDoc.exists()) {
            const currentData = currentDoc.data();
            updateData.authorId = currentData.authorId; // Preserve authorId
            updateData.views = currentData.views || 0; // Preserve views
        }

        await updateDoc(docRef, updateData);
        
        // Return with ISO string for frontend use
        return { 
            id, 
            ...updateData,
            updatedAt: updateData.updatedAt.toISOString()
        };
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
  }

  // Delete post (with author check handled by security rules)
  async deletePost(id) {
    try {
      // Get post data to delete associated image
      const post = await this.getPost(id);
      
      // Delete image from storage if exists
      if (post.image) {
        const imageRef = ref(storage, post.image);
        try {
          await deleteObject(imageRef);
        } catch (imageError) {
          console.warn('Could not delete image:', imageError);
        }
      }

      // Delete document
      await deleteDoc(doc(db, this.collectionName, id));
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Increment view count
  async incrementViews(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentViews = docSnap.data().views || 0;
        await updateDoc(docRef, {
          views: currentViews + 1
        });
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }

  // Get author information for posts
  async getAuthorInfo(authorId) {
    try {
      const docRef = doc(db, 'user', authorId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        return {
          id: authorId,
          name: userData.name,
          email: userData.email,
          role: userData.role
        };
      } else {
        return {
          id: authorId,
          name: 'Unknown Author',
          email: '',
          role: 'unknown'
        };
      }
    } catch (error) {
      console.error('Error getting author info:', error);
      return {
        id: authorId,
        name: 'Unknown Author',
        email: '',
        role: 'unknown'
      };
    }
  }

    // Get all users (for super admin)
    async getUsersList() {
        try {
            const q = query(
                collection(db, 'user'),
                orderBy('createdAt', 'desc')
            );
            
            const querySnapshot = await getDocs(q);
            const user = [];
            
            querySnapshot.forEach((doc) => {
                user.push({ id: doc.id, ...doc.data() });
            });

            return user;
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    }

    // Update user (for super admin)
    async updateUser(userId, userData) {
        try {
            const docRef = doc(db, 'user', userId);
            const updateData = {
                ...userData,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(docRef, updateData);
            return { id: userId, ...updateData };
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Delete user (for super admin)
    async deleteUser(userId) {
    try {
        // Delete user document from Firestore
        await deleteDoc(doc(db, 'user', userId));
        
        // Note: We cannot delete users from Firebase Auth client-side
        // This would need to be done server-side using Firebase Admin SDK
        // For now, we'll just remove from Firestore
        
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
    }
}

export default new BlogService();