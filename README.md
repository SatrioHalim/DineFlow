# DineFlow

DineFlow is a web-based restaurant point-of-sale (POS) and order management system. It helps restaurant teams manage menus, tables, users, orders, kitchen workflows, and customer payments from one application.

The project was built as a portfolio project to demonstrate a role-based business application with real-time data updates, server-side actions, validation, and payment gateway integration.

## Features

- Role-based access for `admin`, `cashier`, and `kitchen` users
- Authentication and session management with Supabase Auth
- Admin dashboard with order overview and sales visualization
- Menu management with categories, pricing, discounts, availability, and image uploads
- Table management with capacity and availability status
- User management with role assignment
- Order creation, table reservation, menu selection, notes, and order status tracking
- Kitchen-friendly order workflow for processing order items
- Real-time order updates through Supabase Realtime
- Midtrans Snap payment integration
- Form validation with clear error handling
- Responsive interface with dark mode support

## Tech Stack

### Frontend

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui and Base UI
- React Hook Form
- Zod
- TanStack React Query
- Zustand
- Recharts
- Lucide React

### Backend and services

- Next.js Server Actions
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Supabase Realtime
- Midtrans Snap

### Development and deployment

- Node.js 20
- Docker and Docker Compose
- ESLint

## Application Roles

| Role | Responsibility |
| --- | --- |
| Admin | Dashboard, orders, menus, tables, and user management |
| Cashier | Create and manage customer orders and payments |
| Kitchen | View orders and update order-item progress |

## Getting Started

### Prerequisites

- Node.js 20 or newer
- A Supabase project
- A Midtrans account for payment testing

### Installation

```bash
git clone <repository-url>
cd dineflow
npm install
```

Create a `.env.local` file based on `.env.example` and configure the Supabase and Midtrans credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_VERSION=

NEXT_PUBLIC_MIDTRANS_API_URL=
NEXT_PUBLIC_MIDTRANS_API_CLIENT_KEY=
MIDTRANS_SERVER_KEY=
```

Run the SQL migration files in `src/migrations` in numerical order inside the Supabase SQL Editor. Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Development

Make sure `.env.local` is configured, then run:

```bash
docker compose -f docker-compose.dev.yml up --build
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev       # Start the development server
npm run build     # Build the production application
npm run start     # Start the production server
npm run lint      # Run ESLint
```

## Project Structure

```text
src/
├── actions/       # Server actions for authentication, storage, and orders
├── app/           # App Router pages, layouts, and feature modules
├── components/    # Shared UI and reusable components
├── constants/     # Application constants and table definitions
├── hooks/         # Reusable React hooks
├── lib/           # Supabase clients and utilities
├── migrations/    # Supabase database schema and seed data
├── providers/     # React Query, auth, and theme providers
├── stores/        # Zustand stores
├── types/         # TypeScript declarations
└── validations/   # Zod validation schemas
```

## Portfolio Highlights

- Designed a multi-role workflow for restaurant operations
- Implemented Supabase client patterns for browser, server, and middleware contexts
- Connected order creation with payment token generation through Midtrans
- Used relational PostgreSQL data for menus, tables, orders, and order items
- Built reusable forms, data tables, dialogs, pagination, and feedback components

## Status

This project is actively developed as a portfolio implementation of a restaurant POS system.
