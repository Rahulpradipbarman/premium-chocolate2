# Deployment & Admin Dashboard Implementation Plan

This document outlines the step-by-step strategy to transition your project from a static/hardcoded frontend to a fully dynamic e-commerce site where the client can manage their own products, and how to deploy the entire stack to production.

## Phase 1: Database Setup (Supabase)

To allow the client to add products dynamically, we need to create a database schema for products and a secure way to store product images.

1.  **Create the `products` Table:**
    Create a new table in Supabase to store product details.
    ```sql
    CREATE TABLE public.products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image_url TEXT,
      stock INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ```
2.  **Add Admin Roles:**
    Add a `role` column to your existing `users` table so we can distinguish regular customers from the store admin.
    ```sql
    ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'customer';
    -- The client's account will have the role 'admin'
    ```
3.  **Configure Supabase Storage (Buckets):**
    Create a storage bucket named `product-images` in Supabase. This is where the client's uploaded product photos will be saved. We'll set this bucket to be publicly readable.

---

## Phase 2: Backend API Development (Express/Node.js)

Your backend needs new endpoints to handle product creation and image uploads.

1.  **Product CRUD Endpoints:**
    *   `GET /api/products`: Fetch all products (publicly accessible).
    *   `POST /api/products`: Add a new product (admin only).
    *   `PUT /api/products/:id`: Update an existing product (admin only).
    *   `DELETE /api/products/:id`: Remove a product (admin only).
2.  **Admin Protection Middleware:**
    Create a middleware function to ensure only users with `role === 'admin'` can access the POST, PUT, and DELETE endpoints.
3.  **Image Upload Integration:**
    Integrate `multer` on the backend to handle image file uploads from the admin dashboard and forward them to the Supabase `product-images` bucket.

---

## Phase 3: Frontend Development (Admin Panel & Dynamic Store)

We need to build the interface where the client will log in and manage their inventory.

1.  **Protected Admin Route:**
    Create a protected `/admin` route in your React app. If a user logs in and their role is not 'admin', redirect them to the home page.
2.  **Admin Dashboard UI:**
    Build a simple, clean dashboard containing:
    *   A list of current products with edit/delete buttons.
    *   An "Add New Product" form containing fields for: Product Name, Description, Price, Stock Quantity, and a File Input for the image.
3.  **Dynamic Storefront:**
    Update the main shop page (`/shop` or wherever products are displayed). Remove the hardcoded JavaScript arrays and replace them with a `useEffect` hook that fetches the live product data from `GET /api/products`.

---

## Phase 4: Production Deployment

Deploying the application requires hosting the Database, Backend, and Frontend separately for optimal performance.

1.  **Database (Supabase):**
    *   Your Supabase project is already in the cloud. Ensure you have separate "development" and "production" Supabase projects if possible, or just use the current one for production.
2.  **Backend (Render or Railway):**
    *   Host your Node.js/Express `server` folder on a platform like [Render](https://render.com/) or [Railway](https://railway.app/).
    *   Set up your Production Environment Variables (`DATABASE_URL`, `SUPABASE_KEY`, etc.) in the hosting provider's dashboard.
3.  **Frontend (Vercel or Netlify):**
    *   Host your React `client` folder on [Vercel](https://vercel.com/) (highly recommended for React/Vite).
    *   Update the frontend's API base URL environment variable to point to your new live Render/Railway backend URL instead of `http://localhost:5000`.
4.  **Custom Domain:**
    *   Purchase a domain (e.g., `clientbrand.com`) and link it to your Vercel frontend project.

---

## Phase 5: Client Handover

1.  **Admin Account Creation:**
    Create an account for the client and manually set their role to `admin` in the Supabase database.
2.  **Documentation/Training:**
    Provide the client with a short video or a PDF guide showing them how to:
    *   Log into the admin portal.
    *   Add a new product with an image.
    *   Edit pricing or mark items out of stock.

***

### Next Steps
Would you like to start by setting up the Database Phase (creating the products table and storage bucket), or would you prefer to start working on the Admin Dashboard UI on the frontend?
