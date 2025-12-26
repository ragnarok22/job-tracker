# Job Application Tracker

A minimalist web application to track and manage job applications, built with Next.js 16 and Prisma 7.

## Features

- **Kanban Board**: Visual drag & drop interface to manage jobs across 5 stages (Wishlist, Applied, Interview, Offer, Rejected)
- **Follow-up View**: Automatically tracks jobs that need action today or are overdue
- **Offers View**: Compare and review all job offers in one place
- **Quick Add**: Fast job entry with just company name and role
- **Priority & Feelings**: Track job priority and your sentiment about each opportunity
- **No External Services**: Everything runs locally with SQLite

## Tech Stack

- **Next.js 16** (App Router) - React framework
- **Prisma 7** - Database ORM
- **SQLite** - Local database (via better-sqlite3)
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **@dnd-kit** - Drag & drop functionality
- **date-fns** - Date formatting

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:migrate

# (Optional) Seed database with sample data
pnpm db:seed

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:migrate` - Run Prisma migrations
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
src/
├── app/
│   ├── actions.ts          # Server actions for CRUD operations
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Main board view
│   ├── follow-up/
│   │   └── page.tsx        # Follow-up view
│   └── offers/
│       └── page.tsx        # Offers view
├── components/
│   ├── Board.tsx           # Main kanban board with drag & drop
│   ├── Column.tsx          # Board column (stage)
│   ├── JobCard.tsx         # Job card component
│   ├── SortableJobCard.tsx # Draggable job card wrapper
│   └── QuickAddModal.tsx   # Quick add job modal
└── lib/
    ├── prisma.ts           # Prisma client instance
    └── types.ts            # Shared TypeScript types

prisma/
├── schema.prisma           # Database schema
├── seed.ts                 # Seed script
└── migrations/             # Database migrations
```

## Database Schema

### JobApplication

- `id` - Unique identifier (UUID)
- `company` - Company name (required)
- `role` - Job title
- `stage` - Application stage (WISHLIST | APPLIED | INTERVIEW | OFFER | REJECTED)
- `appliedDate` - Date application was submitted
- `lastUpdate` - Auto-updated timestamp
- `nextActionDate` - Date for next follow-up action
- `salaryRange` - Salary information
- `priority` - Job priority (HIGH | MEDIUM | LOW)
- `feeling` - Sentiment about the opportunity (👍 😐 👎)
- `link` - URL to job posting
- `notes` - Additional notes
- `createdAt`, `updatedAt` - Timestamps

## How It Works

### Architecture

This is a **Next.js monolith** using:

- **React Server Components** for data fetching
- **Server Actions** for mutations (no separate API routes needed)
- **SQLite** for local-first data persistence

### Drag & Drop Implementation

Uses `@dnd-kit` library for accessible, touch-friendly drag & drop:

- Smooth animations and transitions
- Visual feedback during drag operations
- Works on mobile and desktop
- Automatically updates job stage when dropped in new column

### Data Flow

1. Server Components fetch data directly from Prisma
2. Client Components handle interactivity (drag & drop, modals)
3. Server Actions handle mutations and revalidate pages
4. Optimistic UI updates for better UX

## Customization

### Adding Fields

1. Update `prisma/schema.prisma`
2. Run `pnpm db:migrate`
3. Update TypeScript types in `src/lib/types.ts`
4. Add fields to components and forms

### Changing Stages

Modify the `Stage` enum in both:

- `prisma/schema.prisma`
- `src/lib/types.ts`

Then run `pnpm db:migrate`.

## Production Deployment

While this project uses SQLite for simplicity, you can easily migrate to PostgreSQL for production:

1. Update `datasource` in `prisma/schema.prisma` to `postgresql`
2. Change the adapter in `src/lib/prisma.ts`
3. Deploy to Vercel, Railway, or any Node.js hosting

## License

MIT
