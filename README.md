## Awarely — Relationship App that should build stronger Connections and understanding

Awarely is a modular, authentication-driven web application built with Next.js 15 (App Router), Supabase, and Tailwind CSS.
It provides an extensible foundation for building a secure, real-time, and user-centric application with both authenticated and anonymous user flows.

## Core Features

Supabase Auth Integration
  - Email/password sign-up & sign-in
  - Anonymous login with session persistence
  - Context-based auth state management

App Router Architecture (Next.js 15)
  - Server & client components
  - Centralized AuthProvider for global auth state
  - Clean routing and layout composition

Extensible UI Layer
  - Login and register flows
  - Dashboard scaffolding with tabbed navigation
  - Tailwind styling + Lucide icons

DX-friendly setup
  - Modular file structure
  - Ready for future integrations (e.g., RLS policies, Realtime API)

Tech Stack
  - Framework: Next.js 15 //App Router
  - Backend/Auth: Supabase
  - Styling: Tailwind CSS
  - Icons: Lucide Icons
  - State: React Context API

## Project Structure
src/
 ├─ app/
 │   ├─ auth/
 │   │   ├─ AuthWrapper.jsx        # Handles routing logic based on auth state
 │   │   └─ LoginForm.jsx          # Login & registration UI
 │   ├─ components/
 │   │   └─ AuthContext.jsx        # Global auth provider & hooks
 │   ├─ layout.js                  # Root layout with AuthProvider
 │   └─ page.js                    # Entry point
 ├─ lib/
 │   └─ supabaseClient.js          # Supabase client initialization
 └─ styles/
     └─ globals.css

## Installation & Setup
# 1. Clone repository
git clone https://github.com/yourusername/awarely.git
cd awarely

# 2. Install dependencies
npm install

# 3. Add environment variables
cp .env.example .env.local
# Fill in the Supabase project credentials

# 4. Run development server
npm run dev

Environment Variables
NEXT_PUBLIC_SUPABASE_URL	        # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY	    #Supabase anon API key

## Authentication Flow
  - AuthContext initializes Supabase client and subscribes to onAuthStateChange
  - Anonymous users can log in via supabase.auth.signInAnonymously()
  - Authenticated users are stored in React Context for global access
  - Protected routes can be conditionally rendered via useAuth()


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
