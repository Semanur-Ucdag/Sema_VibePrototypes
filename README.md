# Mental Care Group Prototyping

Built with a cutting-edge tech stack focused on performance, developer experience, and user privacy.

---

## Tech Stack

### Nuxt 4

**What it is:**  
Nuxt is a powerful Vue.js framework that enables developers to build server-side rendered (SSR), static, and hybrid web applications. Nuxt 4 is the latest major version, bringing improved performance, better TypeScript support, and a refined developer experience.

**Why professional developers use it:**
- **Server-Side Rendering (SSR):** Improves SEO and initial page load times by rendering pages on the server before sending them to the client
- **File-based routing:** Automatically generates routes based on your file structure, reducing boilerplate code
- **Auto-imports:** Components, composables, and utilities are automatically imported, keeping code clean
- **Hybrid rendering:** Choose between SSR, SSG (Static Site Generation), or client-side rendering on a per-route basis
- **Built-in optimizations:** Code splitting, lazy loading, and image optimization come out of the box
- **Strong ecosystem:** Extensive module system with official and community modules for common functionality

---

### Nuxt UI

**What it is:**  
Nuxt UI is the official UI library for Nuxt applications. It provides a comprehensive collection of fully-styled, accessible, and customizable components built on top of Reka and Tailwind CSS.

**Why professional developers use it:**
- **Production-ready components:** Buttons, forms, modals, tables, and 50+ other components ready to use
- **Accessibility first:** All components follow WAI-ARIA guidelines and support keyboard navigation
- **Dark mode support:** Built-in dark mode that works seamlessly with Tailwind CSS
- **Highly customizable:** Components can be styled and configured globally or individually via props
- **Tight Nuxt integration:** Designed specifically for Nuxt, ensuring optimal performance and DX
- **Consistent design system:** Provides a cohesive look and feel across the entire application
- **Reduced development time:** No need to build common UI patterns from scratch

---

### Tailwind CSS

**What it is:**  
Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs directly in your markup. Instead of writing custom CSS, you compose styles using predefined classes.

**Why professional developers use it:**
- **Rapid development:** Build complex UIs quickly without leaving your Vue templates
- **Design consistency:** Predefined spacing, colors, and typography scales ensure visual consistency
- **No CSS bloat:** Only the classes you use are included in the final build (via PurgeCSS)
- **Responsive design:** Built-in responsive modifiers (`sm:`, `md:`, `lg:`, etc.) make mobile-first design effortless
- **Customizable design system:** Easily configure colors, fonts, spacing, and more`
- **No naming conflicts:** Utility classes eliminate the need to invent class names or deal with CSS specificity issues
- **Great documentation:** Comprehensive docs with examples for every utility class
- **Industry adoption:** Used by companies like GitHub, Netflix, and Shopify

---

### Supabase

**What it is:**  
Supabase is an open-source Firebase alternative that provides a complete backend-as-a-service platform. It offers a PostgreSQL database, real-time subscriptions, authentication, storage, and edge functions.

**Why professional developers use it:**
- **PostgreSQL power:** Full-featured relational database with SQL support, joins, and complex queries
- **Real-time subscriptions:** Listen to database changes in real-time for live updates
- **Row Level Security (RLS):** Fine-grained access control at the database level for robust security
- **Auto-generated APIs:** RESTful and GraphQL APIs are automatically generated from your database schema
- **Built-in authentication:** Supports email/password, OAuth providers, and magic links
- **Storage solution:** Manage and serve files with built-in CDN support
- **Edge Functions:** Run serverless TypeScript functions close to your users
- **Open source:** Self-host if needed, no vendor lock-in
- **Scalability:** Handles everything from MVPs to enterprise applications
- **Privacy compliance:** Important for health data—can be self-hosted for full data control

---

### Clerk

**What it is:**  
Clerk is a complete user management and authentication platform. It provides pre-built UI components, APIs, and admin dashboards for handling user sign-up, sign-in, profile management, and session handling.

**Why professional developers use it:**
- **Drop-in authentication:** Pre-built, customizable sign-in/sign-up components that work out of the box
- **Multi-factor authentication (MFA):** Built-in support for TOTP, SMS, and backup codes
- **Social login:** One-click integration with Google, GitHub, Apple, and 20+ OAuth providers
- **Session management:** Secure session handling with automatic token refresh
- **User management dashboard:** Admin panel to manage users, view analytics, and handle support issues
- **Webhooks:** React to user events (sign-ups, deletions, etc.) in your backend
- **HIPAA compliance ready:** Essential for mental health applications handling sensitive user data
- **Role-based access control:** Define roles and permissions for different user types
- **Embeddable components:** Beautiful, accessible UI components that match your brand
- **SDKs for all frameworks:** First-class support for Nuxt/Vue, React, and more

---

## Why This Stack?

This technology combination was chosen specifically for building a mental health dashboard:

| Requirement | Solution |
|-------------|----------|
| **Performance** | Nuxt 4 SSR + Edge rendering |
| **Beautiful UI** | Nuxt UI + Tailwind CSS |
| **Data Security** | Supabase RLS + Clerk authentication |
| **Real-time Updates** | Supabase real-time subscriptions |
| **HIPAA Considerations** | Clerk compliance features + Supabase self-hosting option |
| **Developer Productivity** | Full-stack TypeScript, auto-imports, pre-built components |
| **Scalability** | Serverless architecture, managed services |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Clerk
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

---

## Project Structure

```
├── app/
│   ├── components/     # Vue components
│   ├── composables/    # Reusable composition functions
│   ├── layouts/        # Page layouts
│   ├── pages/          # File-based routing
│   └── utils/          # Utility functions
├── server/
│   ├── api/            # Server API routes
│   └── middleware/     # Server middleware
├── public/             # Static assets
├── nuxt.config.ts      # Nuxt configuration
└── tailwind.config.ts  # Tailwind configuration
```

---

## License

[MIT](LICENSE)
