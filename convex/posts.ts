import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const createPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImageId: v.optional(v.id('_storage'))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    
    if (!identity) {
      throw new Error('Not authenticated')
    }

    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))
      .first()

    if (!user) {
      throw new Error(`User ${identity.email} not found. Please make sure you have an account.`)
    }

    const existingPost = await ctx.db
      .query('posts')
      .withIndex('bySlug', (q) => q.eq('slug', args.slug))
      .first()

    if (existingPost) {
      throw new Error('A post with this slug already exists')
    }

    const postId = await ctx.db.insert('posts', {
      title: args.title,
      slug: args.slug,
      excerpt: args.excerpt,
      content: args.content,
      coverImageId: args.coverImageId,
      authorId: user._id,
      likes: 0
    })

    const userPosts = user.posts || []
    await ctx.db.patch(user._id, {
      posts: [...userPosts, postId]
    })

    return args.slug
  }
})

export const getPosts = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query('posts')
      .order('desc')
      .collect()

    // Return early if no posts exist
    if (posts.length === 0) {
      return []
    }

    // Fetch author data for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId)
        
        return {
          ...post,
          author: author || null
        }
      })
    )

    return postsWithAuthors
  }
})

export const getRecentPosts = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query('posts')
      .order('desc')
      .take(5) // Get only 5 most recent posts

    // Return early if no posts exist
    if (posts.length === 0) {
      return []
    }

    // Fetch author data for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId)
        
        return {
          ...post,
          author: author || null
        }
      })
    )

    return postsWithAuthors
  }
})

export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query('posts')
      .withIndex('bySlug', (q) => q.eq('slug', args.slug))
      .first()

    if (!post) {
      return null
    }

    const author = await ctx.db.get(post.authorId)
    
    // Get cover image URL if it exists
    let coverImageUrl = undefined
    if (post.coverImageId) {
      coverImageUrl = await ctx.storage.getUrl(post.coverImageId)
    }

    return {
      ...post,
      author: author || null,
      coverImageUrl
    }
  }
})

export const likePost = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query('posts')
      .withIndex('bySlug', (q) => q.eq('slug', args.slug))
      .first()

    if (!post) {
      throw new Error('Post not found')
    }

    await ctx.db.patch(post._id, {
      likes: post.likes + 1
    })
  }
})

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});