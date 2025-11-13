# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LungiLok is a Next.js 15 e-commerce application for selling traditional clothing (Lungi and Panjabi). The stack includes:
- Next.js 15 with App Router
- TypeScript
- MongoDB with Mongoose ODM
- Firebase Authentication (email/password, Google, Facebook)
- Tailwind CSS v4
- React 19

## Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000

# Build & Production
npm run build            # Build for production
npm start               # Start production server

# Type Checking & Linting
npm run typecheck       # Run TypeScript compiler without emitting
npm run lint            # Run Next.js linter
```

## Architecture

### Authentication System
The app uses a dual authentication system:
- **Firebase Auth**: Handles user authentication (email/password, Google, Facebook)
- **Firestore**: Stores extended user profile data (fullName, phone)
- **AuthProvider**: Context provider at `src/components/Provider/Authcontext.tsx` manages auth state globally
- **ProtectedRoute**: Component at `src/components/Route/ProtectedRoute.tsx` guards authenticated routes

Firebase configuration is in `src/firebase/firebase.ts` with popup-first authentication that falls back to redirect for blocked popups.

### Database Architecture
- **MongoDB**: Primary database for product catalog
- **Firestore**: User profile storage
- Connection pooling implemented in `src/lib/mongodb.ts` with cached connections for serverless optimization
- Product model at `src/models/Product.ts` with comprehensive schema including categories (lungi, panjabi, traditional, others)

### Route Structure
The app uses Next.js App Router with route groups:
- `src/app/(main)/` - Main storefront (with NavBar/Footer)
- `src/app/dashboard/*` - Admin dashboard (no NavBar/Footer)
- `src/app/login/` and `src/app/register/` - Auth pages
- `src/app/product/[id]/` - Dynamic product detail pages
- `src/app/api/products/` - REST API routes for product CRUD

### Layout System
`ConditionalLayout` component (`src/components/ConditionalLayout.tsx`) conditionally renders NavBar/Footer based on pathname:
- Dashboard routes (`/dashboard/*`): No layout chrome
- All other routes: Includes NavBar and Footer

### API Routes
Product API at `src/app/api/products/route.ts`:
- `GET /api/products` - Fetch products with optional filters (category, search, featured, onSale)
- `POST /api/products` - Create new product (requires name, description, price, category)
- Individual product routes at `/api/products/[id]/`

### Product Schema
Products include:
- Required: name, description, price, category, images (array)
- Optional: originalPrice, discount, brand, subcategory, sizes, colors, materials, tags
- Auto-managed: inStock (based on stock quantity), slug (unique)
- Categories: lungi, panjabi, traditional, others
- Text search indexes on name and description

## Environment Variables

Required in `.env.local`:
- `MONGODB_URI` - MongoDB connection string (defaults to `mongodb://localhost:27017/lungilok`)
- Firebase credentials are hardcoded in `src/firebase/firebase.ts` (should be moved to env vars)

## TypeScript Configuration

Path alias `@/*` maps to `src/*` for imports. Node version required: 20.x (specified in package.json engines).

## Next.js Configuration

Custom headers in `next.config.ts` for CORS:
- `Cross-Origin-Opener-Policy: same-origin-allow-popups` (enables popup-based OAuth)
- `Cross-Origin-Embedder-Policy: unsafe-none`

## Key Components

- **NavBar**: Main navigation at `src/components/shared/NavBar.tsx`
- **ProductListing**: Product grid at `src/components/productListing/ProductListing.tsx`
- **ProductDetails**: Product detail view at `src/components/ProductDetails/ProductDetails.tsx`
- **Category**: Category filtering at `src/components/Category/Category.tsx`
- **DashboardLayout**: Admin dashboard layout wrapping dashboard pages

## Dashboard Features

Admin dashboard at `/dashboard` includes:
- Overview with stats cards (total products, value, low stock alerts)
- Product management (create, edit, delete)
- Profile management at `/dashboard/profile`
- Products list at `/dashboard/products`
- Product editor at `/dashboard/manage`

Protected by ProtectedRoute - requires authentication to access.
