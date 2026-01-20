# Tunisia Travel - Tourism Website

A production-ready travel website for Tunisia tourism built with Next.js 14+, TypeScript, Tailwind CSS, and Supabase.

## Features

### Public Website
- Browse published travel programs
- View program details with image gallery
- Submit reservation requests (no login required)
- Responsive mobile-first design
- Tunisia-themed UI

### Admin Panel
- Password-protected admin area
- Create, edit, and delete programs
- Publish/unpublish programs
- Upload images to Supabase Storage
- View all reservation requests

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## Project Structure

```
tunisia-travel/
├── app/
│   ├── admin/
│   │   ├── programs/
│   │   │   ├── new/
│   │   │   └── edit/[id]/
│   │   └── reservations/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── auth/
│   │   │   └── upload/
│   │   ├── programs/
│   │   └── reservations/
│   ├── programs/
│   │   └── [id]/
│   └── reservation-success/
├── components/
│   ├── admin/
│   └── public/
├── lib/
├── supabase/
│   ├── schema.sql
│   └── seed.sql
└── types/
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
cd tunisia-travel
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase/schema.sql`
3. Run `supabase/seed.sql` to add sample data

### 3. Configure Environment Variables

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=your-secure-admin-password
```

### 4. Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `program-images`
3. Make it public
4. The schema.sql includes storage policies

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
4. Deploy!

## Deployment Checklist

- [ ] Supabase project created
- [ ] Database schema deployed (schema.sql)
- [ ] Sample data added (seed.sql) - optional
- [ ] Storage bucket created (`program-images`)
- [ ] Storage policies configured
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] Test admin login
- [ ] Test program creation
- [ ] Test image upload
- [ ] Test reservation submission

## Routes

### Public Routes
| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/programs` | All programs list |
| `/programs/[id]` | Program details |
| `/reservation-success` | Reservation confirmation |

### Admin Routes (Protected)
| Route | Description |
|-------|-------------|
| `/admin` | Admin login |
| `/admin/programs` | Programs management |
| `/admin/programs/new` | Create program |
| `/admin/programs/edit/[id]` | Edit program |
| `/admin/reservations` | View reservations |

## API Endpoints

### Programs
- `GET /api/programs` - List published programs
- `POST /api/programs` - Create program (admin)
- `GET /api/programs/[id]` - Get program
- `PUT /api/programs/[id]` - Update program (admin)
- `PATCH /api/programs/[id]` - Partial update (admin)
- `DELETE /api/programs/[id]` - Delete program (admin)

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations` - List reservations (admin)

### Admin
- `POST /api/admin/auth` - Login
- `DELETE /api/admin/auth` - Logout
- `POST /api/admin/upload` - Upload image

## Security

- Admin routes protected by middleware
- Session stored in HTTP-only cookie
- RLS policies on Supabase tables
- Service role key only used server-side
- Input validation on all forms

## Customization

### Styling
- Edit `tailwind.config.ts` for colors and theme
- Edit `app/globals.css` for custom styles
- Tunisia theme colors defined in Tailwind config

### Content
- Update seed.sql with your programs
- Replace image URLs with your own
- Edit Footer.tsx for contact information

## License

MIT License
