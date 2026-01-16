export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  author: {
    name: string
    avatar: string
  }
  coverImage: string
  category: string
  tags: string[]
  readingTime: string
}

export interface Category {
  slug: string
  name: string
  description: string
  postCount: number
}

// Mock blog posts data
export const posts: Post[] = [
  {
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js 16: A Complete Guide",
    excerpt:
      "Learn how to build modern web applications with Next.js 16, including the latest features like Turbopack and improved caching.",
    content: `Next.js 16 brings exciting new features that make building web applications faster and more efficient. In this comprehensive guide, we'll explore the key improvements and how to leverage them in your projects.

## What's New in Next.js 16

Next.js 16 introduces several game-changing features:

- **Turbopack as Default**: The new bundler is now stable and provides significantly faster build times
- **Improved Caching APIs**: Better control over data caching with revalidateTag and updateTag
- **React 19 Support**: Full support for the latest React features
- **Enhanced Performance**: Optimizations across the board for faster page loads

## Getting Started

To create a new Next.js 16 project, simply run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

This will set up a new project with all the latest features enabled by default.

## Key Features to Explore

### Server Components
Server Components are the foundation of modern Next.js applications. They allow you to render components on the server, reducing client-side JavaScript and improving performance.

### App Router
The App Router provides a powerful file-based routing system with support for layouts, loading states, and error boundaries.

### Data Fetching
Next.js 16 makes data fetching simple with async Server Components and the new caching APIs.

## Conclusion

Next.js 16 is a significant release that makes building web applications more enjoyable and efficient. Start exploring these features today!`,
    date: "2025-01-10",
    author: {
      name: "Sarah Johnson",
      avatar: "/professional-woman-developer.png",
    },
    coverImage: "/nextjs-coding-dashboard-modern-blue.jpg",
    category: "web-development",
    tags: ["Next.js", "React", "Web Development"],
    readingTime: "8 min read",
  },
  {
    slug: "typescript-best-practices-2025",
    title: "TypeScript Best Practices for 2025",
    excerpt:
      "Discover the latest TypeScript patterns and practices that will make your code more maintainable and type-safe.",
    content: `TypeScript has become the de facto standard for building large-scale JavaScript applications. Let's explore the best practices that will help you write better TypeScript code in 2025.

## Type Safety First

Always prioritize type safety in your TypeScript projects. Use strict mode and avoid 'any' types whenever possible.

## Utility Types

TypeScript provides powerful utility types that can help you write more concise and expressive code:

- **Pick**: Select specific properties from a type
- **Omit**: Exclude specific properties from a type
- **Partial**: Make all properties optional
- **Required**: Make all properties required

## Generics

Master generics to write reusable and type-safe code. Generics allow you to create components and functions that work with multiple types.

## Conclusion

Following these best practices will help you write more maintainable and reliable TypeScript code.`,
    date: "2025-01-08",
    author: {
      name: "Michael Chen",
      avatar: "/professional-man-developer-asian.jpg",
    },
    coverImage: "/typescript-code-editor-dark-theme.jpg",
    category: "programming",
    tags: ["TypeScript", "JavaScript", "Best Practices"],
    readingTime: "6 min read",
  },
  {
    slug: "modern-css-techniques",
    title: "Modern CSS Techniques You Should Know",
    excerpt:
      "From container queries to CSS Grid, explore the modern CSS features that will transform how you build layouts.",
    content: `CSS has evolved significantly in recent years. Let's explore the modern techniques that will help you build better user interfaces.

## Container Queries

Container queries allow you to style elements based on their container's size, not just the viewport. This is a game-changer for component-based design.

## CSS Grid

CSS Grid provides a powerful two-dimensional layout system. Combined with Flexbox, you can create any layout imaginable.

## Custom Properties

CSS custom properties (variables) enable you to create maintainable and themeable designs.

## Modern Selectors

New CSS selectors like :has(), :is(), and :where() provide more power and flexibility in your stylesheets.

## Conclusion

These modern CSS techniques will help you build more maintainable and responsive user interfaces.`,
    date: "2025-01-05",
    author: {
      name: "Emily Rodriguez",
      avatar: "/professional-woman-designer-latina.jpg",
    },
    coverImage: "/css-grid-layout-colorful-modern.jpg",
    category: "design",
    tags: ["CSS", "Design", "Web Development"],
    readingTime: "7 min read",
  },
  {
    slug: "react-server-components-explained",
    title: "React Server Components Explained",
    excerpt: "Understand how React Server Components work and why they're revolutionary for building web applications.",
    content: `React Server Components represent a fundamental shift in how we build React applications. Let's dive deep into how they work.

## What Are Server Components?

Server Components are React components that run exclusively on the server. They allow you to build data-intensive UIs without sending JavaScript to the client.

## Benefits

- **Zero Bundle Size**: Server Components don't add to your client-side bundle
- **Direct Backend Access**: Access databases and APIs directly without creating API routes
- **Automatic Code Splitting**: Only client components are sent to the browser

## When to Use Server Components

Use Server Components for:
- Data fetching
- Accessing backend resources
- Keeping sensitive information on the server

## Client Components

Client Components are necessary for:
- Interactivity and event handlers
- Browser-only APIs
- State and effects

## Conclusion

Server Components are the future of React development, enabling better performance and developer experience.`,
    date: "2025-01-03",
    author: {
      name: "David Park",
      avatar: "/professional-man-developer-korean.jpg",
    },
    coverImage: "/react-components-server-architecture-diagram.jpg",
    category: "web-development",
    tags: ["React", "Server Components", "Next.js"],
    readingTime: "10 min read",
  },
  {
    slug: "web-accessibility-guide",
    title: "The Complete Web Accessibility Guide",
    excerpt: "Learn how to make your websites accessible to everyone with practical tips and techniques.",
    content: `Web accessibility ensures that everyone, regardless of their abilities, can use your website. Here's a comprehensive guide to building accessible web applications.

## Why Accessibility Matters

Accessibility isn't just about compliance—it's about creating better experiences for all users.

## Semantic HTML

Use semantic HTML elements like <nav>, <main>, <article>, and <aside> to provide structure and meaning to your content.

## ARIA Attributes

ARIA (Accessible Rich Internet Applications) attributes enhance the accessibility of dynamic content and custom controls.

## Keyboard Navigation

Ensure all interactive elements are keyboard accessible. Users should be able to navigate your site without a mouse.

## Color Contrast

Maintain sufficient color contrast between text and backgrounds to ensure readability for users with visual impairments.

## Testing

Use tools like axe DevTools and screen readers to test your website's accessibility.

## Conclusion

Building accessible websites is essential for creating inclusive digital experiences.`,
    date: "2025-01-01",
    author: {
      name: "Jennifer Williams",
      avatar: "/professional-woman-developer-accessibility.jpg",
    },
    coverImage: "/accessibility-symbols-universal-design.jpg",
    category: "design",
    tags: ["Accessibility", "Web Development", "UX"],
    readingTime: "9 min read",
  },
  {
    slug: "building-scalable-apis",
    title: "Building Scalable APIs with Node.js",
    excerpt: "Best practices for designing and implementing APIs that can handle growth and scale efficiently.",
    content: `Building scalable APIs requires careful planning and implementation. Let's explore the best practices for creating APIs that can grow with your application.

## API Design Principles

Follow RESTful conventions and use consistent naming patterns. Design your API with versioning in mind from the start.

## Authentication and Security

Implement robust authentication using JWT tokens or OAuth. Always use HTTPS and validate all inputs.

## Rate Limiting

Protect your API from abuse by implementing rate limiting. This ensures fair usage and prevents overload.

## Caching Strategies

Use caching effectively to reduce database load and improve response times. Consider Redis for distributed caching.

## Error Handling

Provide clear, consistent error messages with appropriate HTTP status codes. Log errors for debugging and monitoring.

## Documentation

Create comprehensive API documentation using tools like Swagger or Postman. Good documentation is crucial for API adoption.

## Monitoring and Analytics

Implement monitoring to track API performance, errors, and usage patterns. Use this data to optimize and scale.

## Conclusion

Following these practices will help you build APIs that are reliable, secure, and ready to scale.`,
    date: "2024-12-28",
    author: {
      name: "Alex Turner",
      avatar: "/professional-developer-backend.jpg",
    },
    coverImage: "/api-architecture-diagram-cloud-infrastructure.jpg",
    category: "programming",
    tags: ["API", "Node.js", "Backend Development"],
    readingTime: "11 min read",
  },
]

export const categories: Category[] = [
  {
    slug: "web-development",
    name: "Web Development",
    description: "Modern web development tutorials, frameworks, and best practices",
    postCount: posts.filter((p) => p.category === "web-development").length,
  },
  {
    slug: "programming",
    name: "Programming",
    description: "Programming languages, algorithms, and software engineering",
    postCount: posts.filter((p) => p.category === "programming").length,
  },
  {
    slug: "design",
    name: "Design",
    description: "UI/UX design, CSS techniques, and visual design principles",
    postCount: posts.filter((p) => p.category === "design").length,
  },
]

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return posts
    .filter((post) => post.category === categorySlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllCategories(): Category[] {
  return categories
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug)
}

export function getRelatedPosts(currentSlug: string, limit = 3): Post[] {
  const currentPost = getPostBySlug(currentSlug)
  if (!currentPost) return []

  return posts
    .filter(
      (post) =>
        post.slug !== currentSlug &&
        (post.category === currentPost.category || post.tags.some((tag) => currentPost.tags.includes(tag))),
    )
    .slice(0, limit)
}
