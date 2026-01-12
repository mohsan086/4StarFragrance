# 4 Star Fragrance - Luxury Perfume eCommerce

A production-ready luxury eCommerce platform for selling premium fragrances, built with Next.js 16, Supabase, and Vercel Blob.

## Features

- **Product Catalog**: Browse luxury perfumes with detailed descriptions, fragrance notes, and pricing
- **Authentication**: Secure email/password authentication with Supabase Auth
- **Shopping Cart**: Add products to cart with quantity management
- **Checkout**: Complete checkout flow with shipping information and order confirmation
- **User Accounts**: Profile management and order history tracking
- **Admin Dashboard**: Manage products, categories, orders, and inventory
- **Row Level Security**: Database-level security policies for data protection
- **Responsive Design**: Mobile-first design with elegant typography and luxury aesthetics

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, Turbopack)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Vercel Blob (for product images)
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (integration already connected)
- Vercel Blob integration (already connected)

### Database Setup

1. Run the database migration scripts in order:

```bash
# The scripts will be automatically executed through the v0 interface
# Or you can run them manually in your Supabase SQL editor:
# - scripts/001_create_schema.sql
# - scripts/002_seed_data.sql
```

These scripts will:
- Create tables: categories, products, cart_items, orders, order_items, profiles
- Set up Row Level Security (RLS) policies
- Seed initial data (categories and sample products)

### Environment Variables

All required environment variables are already configured:
- Supabase credentials
- Vercel Blob token
- Database connection strings

### Development

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Admin Access

To make a user an admin:

1. Sign up for an account
2. Run this SQL in Supabase SQL Editor:

```sql
UPDATE profiles 
SET is_admin = true 
WHERE id = 'YOUR_USER_ID';
```

You can find your user id in the `auth.users` table.

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication routes
│   ├── account/             # User account pages
│   ├── admin/               # Admin dashboard
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout flow
│   ├── products/            # Product catalog
│   └── order-success/       # Order confirmation
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── ...                  # Custom components
├── lib/                     # Utility functions
│   ├── supabase/           # Supabase clients
│   └── cart-utils.ts       # Cart helper functions
└── scripts/                 # Database scripts
```

## Key Features Explained

### Authentication Flow

- Email/password authentication with Supabase
- Email verification required for new accounts
- Protected routes with middleware
- Session management with HTTP-only cookies

### Shopping Cart

- Persistent cart stored in database (not localStorage)
- Real-time quantity updates
- Stock validation before checkout
- Automatic cart clearing after purchase

### Order Management

- Complete order tracking system
- Status updates: pending → processing → shipped → delivered
- Order history for users
- Admin order management dashboard

### Security

- Row Level Security (RLS) on all tables
- Admin-only access for sensitive operations
- Parameterized queries to prevent SQL injection
- Server-side validation for all mutations

## Database Schema

- **categories**: Product categories with slugs
- **products**: Products with pricing, stock, and fragrance details
- **cart_items**: User shopping carts
- **orders**: Customer orders with shipping info
- **order_items**: Individual items in orders
- **profiles**: Extended user information and admin flags

## Design System

- **Colors**: Warm bronze/gold accents (#D4A574) with neutral grays
- **Typography**: Playfair Display (serif) for headings, Geist Sans for body
- **Layout**: Mobile-first responsive design with flexbox
- **Components**: shadcn/ui component library with custom theming

## Deployment

This project is ready to deploy to Vercel:

1. Click "Publish" in v0 to deploy to Vercel
2. Ensure environment variables are synced
3. Run database migrations in production Supabase project
4. Update Supabase auth redirect URLs for production domain

## Support

For issues or questions:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit [Next.js Documentation](https://nextjs.org/docs)
- Contact support at vercel.com/help

## License

Private project for 4 Star Fragrance.
