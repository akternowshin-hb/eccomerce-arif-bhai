# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LungiLok is a Next.js 15 e-commerce application for selling traditional clothing (Lungi and Panjabi). The stack includes:
- Next.js 15 with App Router
- TypeScript
- MongoDB with Mongoose ODM (handles authentication, users, products, orders)
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
The app uses MongoDB for all authentication and user management:
- **MongoDB User Model**: Handles user authentication with bcrypt password hashing
- **Auth API Routes**: `/api/auth/login` and `/api/auth/register` for email/password authentication
- **AuthProvider**: Context provider at `src/components/Provider/Authcontext.tsx` manages auth state globally using localStorage
- **ProtectedRoute**: Component at `src/components/Route/ProtectedRoute.tsx` guards authenticated routes

### Database Architecture
- **MongoDB**: Single database for all data (users, products, orders)
- Connection pooling implemented in `src/lib/mongodb.ts` with cached connections for serverless optimization
- User model at `src/models/User.ts` with fields: name, email, phone, password (hashed), isAdmin
- Product model at `src/models/Product.ts` with comprehensive schema including categories (lungi, panjabi, traditional, others)
- Order model at `src/models/Order.ts` with support for COD (Cash on Delivery) payments

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
**Product API** at `src/app/api/products/route.ts`:
- `GET /api/products` - Fetch products with optional filters (category, search, featured, onSale)
- `POST /api/products` - Create new product (requires name, description, price, category)
- Individual product routes at `/api/products/[id]/`

**Order API** at `src/app/api/orders/route.ts`:
- `GET /api/orders` - Fetch orders with optional filters (userId, status, paymentStatus)
- `POST /api/orders` - Create new order with COD support, auto-updates product stock and user phone
- Individual order routes at `/api/orders/[id]/`

**Reports API** at `src/app/api/reports/route.ts`:
- `GET /api/reports?type=customers` - Customer reports with order statistics
- `GET /api/reports?type=orders` - Order reports with payment and delivery info
- `GET /api/reports?type=delivery` - Delivery reports with timing metrics
- Supports date filtering with `startDate` and `endDate` query params

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

## TypeScript Configuration

Path alias `@/*` maps to `src/*` for imports. Node version required: 20.x (specified in package.json engines).

## Next.js Configuration

Custom headers in `next.config.ts` for CORS:
- `Cross-Origin-Opener-Policy: same-origin-allow-popups`
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
- Reports page at `/dashboard/reports` with customer, order, and delivery reports (CSV download)

Protected by ProtectedRoute - requires authentication to access.

## E-commerce Features

- **Shopping Cart**: Client-side cart management with CartContext provider
- **Checkout**: COD (Cash on Delivery) payment support with shipping address collection
- **Orders**: Order tracking with status (Pending, Processing, Shipped, Delivered, Cancelled)
- **Reports**: Admin reports for customers, orders, and deliveries with date filtering and CSV export
