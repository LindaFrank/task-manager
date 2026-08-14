# Personal Task Manager

Full-stack task manager built with Next.js (App Router), TypeScript, Tailwind CSS,
Prisma, and PostgreSQL — for Joy of Coding Mod-3, Project 3.

## Features
- Task list showing name, description, and due date
- Create, edit, and delete tasks
- Filter by category (Work / Personal / Learning / Other)
- Auto-sorted by due date, with overdue flagging
- Task completion checkbox
- 12 automated Vitest tests covering sorting, filtering, overdue logic, validation, and grouping

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Get a Postgres database (2 minutes, no local install needed)
Go to [neon.tech](https://neon.tech), sign up free, create a project, and copy the
connection string it gives you. (A local Postgres install works too, if you already have one.)

### 3. Set your environment variable
```bash
cp .env.example .env
```
Paste your connection string into `.env` as `DATABASE_URL`.

### 4. Create the database table
```bash
npx prisma migrate dev --name init
```
This reads `prisma/schema.prisma` and creates the `Task` table for you.

### 5. Run the app
```bash
npm run dev
```
Visit http://localhost:3000

### 6. Run the tests
```bash
npm test
```

## Project structure
```
app/
  page.tsx                 -> main UI (list, form, filters)
  layout.tsx                -> root layout + global styles
  api/tasks/route.ts        -> GET (list) / POST (create)
  api/tasks/[id]/route.ts   -> GET / PUT (edit) / DELETE one task
components/
  TaskForm.tsx               -> shared create/edit form
  TaskItem.tsx                -> single task row, inline edit
  TaskList.tsx                -> renders the list
lib/
  prisma.ts                   -> Prisma client singleton
  taskUtils.ts                 -> pure sort/filter/validate functions (unit tested)
prisma/
  schema.prisma                -> Task model
tests/
  taskUtils.test.ts              -> Vitest suite
```

## Notes for reverse-engineering later
- The DB logic lives only in `app/api/tasks/**` — the UI never talks to Prisma directly.
- `lib/taskUtils.ts` intentionally has zero dependencies on Next.js or Prisma, which is
  why it's easy to unit test in isolation.
- (Optional, not yet implemented) User auth: NextAuth.js is the natural next add if you
  want multi-user support before submitting.
