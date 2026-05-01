# Full-Stack Animated Landing Website

This is a premium brand full-stack landing application.

## Tech Stack
- **Frontend**: React, Vite, React Router v6, Axios, Framer Motion (Optional), Vanilla CSS with Context API.
- **Backend**: Node.js, Express, bcrypt, jsonwebtoken, nodemailer.
- **Database**: Supabase.

## Project Structure
- `client/` - The React Vite application (runs on port 3000)
- `server/` - The Node.js Express application (runs on port 5000)
- `supabase/` - SQL schema to initialize the database tables

## Setup Instructions

### 1. Database Setup (Supabase)
Create a new project in your Supabase account. Go to the SQL Editor in the Supabase Dashboard and run the contents of `supabase/schema.sql` to create the required tables.

### 2. Environment Variables
In the `server/` folder, update the `.env` file with your credentials:
```env
PORT=5000
SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
JWT_SECRET=supersecretjwtkeythatyoushouldchange
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

### 3. Install Dependencies
Run the following in the root directory:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 4. Image Sequence (Hero Section)
To enable the scroll-linked image sequence animation, place your images in `client/public/sequence/` folder. They should be named `000.jpg`, `001.jpg`, up to `079.jpg` (or however many frames you configure in `Home.jsx`). If missing, a colorful placeholder animation is provided automatically.

### 5. Running the Application
From the root directory, start both the frontend and backend concurrently:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend will be available at `http://localhost:5000`.
