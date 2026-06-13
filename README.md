# Aranis E-Commerce Client 🛍️

Modern, high-performance storefront and admin dashboard for the Aranis e-commerce platform. Built with Next.js 16 and React 19.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management & Forms:** React Hook Form, Zod
- **Icons:** Lucide React
- **Text Editor:** Plate.js / React Quill
- **Linting & Formatting:** ESLint, Prettier, Husky, Lint-Staged

## 📁 Project Structure

```text
client/
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js App Router (Public Shop & Admin Dashboard)
│   ├── components/   # Reusable UI components (Common & UI Library)
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utilities, API wrappers, and constants
│   ├── services/     # API integration methods
│   └── types/        # TypeScript type definitions
├── tailwind.config.ts# Tailwind configuration
└── package.json      # Dependencies and scripts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x

### Installation

1. Clone the repository and navigate to the client directory:

   ```bash
   cd aranis/client
   ```

2. Install dependencies (requires `--legacy-peer-deps` due to some React 19 incompatibilities):

   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up your `.env.local` file based on the required environment variables.

### Running the App

Start the development server:

```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the storefront.

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code issues.
- `npm run prettier:fix`: Auto-formats codebase using Prettier.

## 🎨 UI/UX Philosophy

The frontend prioritizes a seamless user experience:

- **Responsive Design:** Fully optimized for mobile, tablet, and desktop.
- **Glassmorphism & Micro-interactions:** Smooth animations using Framer Motion.
- **Optimized Rendering:** Server-side rendering (SSR) and Incremental Static Regeneration (ISR) combined with Next.js caching.
