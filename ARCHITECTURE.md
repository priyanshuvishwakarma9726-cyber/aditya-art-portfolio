# Project Folder Structure

```text
/
├── .env                  # Environment Variables
├── .env.example          # Template for Environment Variables
├── next.config.mjs       # Next.js Config
├── package.json          # Dependencies and Scripts
├── schema.sql            # Database Schema (TiDB)
├── public/               # Public assets
│   ├── images/           # Static images, placeholders
│   ├── icons/            # App icons, favicons
│   └── fonts/            # Custom fonts
├── src/
│   ├── app/              # Next.js 14 App Router
│   │   ├── (admin)/      # Admin Panel Routes (Protected)
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── artworks/page.tsx
│   │   │   │   ├── orders/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (auth)/       # Authentication Routes
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (shop)/       # E-Commerce Routes
│   │   │   ├── shop/page.tsx
│   │   │   ├── shop/[id]/page.tsx
│   │   │   └── cart/page.tsx
│   │   ├── api/          # Next.js API Routes (Backend)
│   │   │   ├── admin/    # Admin-only endpoints
│   │   │   ├── auth/     # Supabase Auth webhooks
│   │   │   ├── artworks/ # Artwork fetching
│   │   │   ├── orders/   # Order processing (Razorpay)
│   │   │   └── upload/   # Local file upload endpoints (admin only)
│   │   ├── blog/         # Blog Routes
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── page.tsx      # Main Landing Page / Hero
│   │   ├── layout.tsx    # Root Layout (Navbar, Footer, Providers)
│   │   └── globals.css   # Global Styles (Tailwind)
│   ├── components/       # Reusable React Components
│   │   ├── ui/           # Basic UI components (Buttons, Inputs, etc.)
│   │   ├── layout/       # Navbar, Footer, Sidebar
│   │   ├── artworks/     # PortfolioGrid, Lightbox, BeforeAfterSlider
│   │   ├── shop/         # Cart, ProductCard
│   │   ├── bot/          # Local Rule Based AI Chatbot
│   │   └── admin/        # Admin specific forms and tables
│   ├── lib/              # Utility functions and setups
│   │   ├── db.ts         # TiDB Connection Setup (mysql2 or Prisma)
│   │   ├── supabase.ts   # Supabase Client Setup
│   │   ├── razorpay.ts   # Razorpay Server Setup
│   │   └── utils.ts      # Helper functions (cn, formatters)
│   ├── types/            # TypeScript Type Definitions
│   │   └── index.ts      # Interfaces for DB Models
│   ├── hooks/            # Custom React Hooks
│   │   ├── use-cart.ts
│   │   └── use-auth.ts
│   └── middleware.ts     # Next.js Middleware for Role/Route Protection
```

### Key Folders Overview
- **`src/app/api/`**: Contains the backend code mapping to Next.js API routes. Allows for server-side logic independent of the client.
- **`src/app/(admin)/`**: A route group dedicated to the admin panel with a shared layout that includes role-based checks.
- **`src/components/bot/`**: Contains the local, rule-based AI AI chatbot component. No external API needed.
- **`src/lib/db.ts`** & **`src/lib/supabase.ts`**: Contains our connection singletons to ensure efficient edge rendering and DB connections.
