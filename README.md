# Task Manager Application

A modern, full-stack task management application built with Next.js 15, featuring user authentication and comprehensive task management capabilities.

## Overview

This Task Manager application allows authenticated users to efficiently manage their personal tasks. Users can create, view, update, and delete tasks with features like priority levels, status tracking, and advanced filtering options.

## Features

- 🔐 **User Authentication**: Secure sign-up and login system
- ✅ **Task Management**: Complete CRUD operations for tasks
- 🎯 **Priority Levels**: Categorize tasks as low, medium, or high priority
- 📊 **Status Tracking**: Mark tasks as pending or completed
- 🔍 **Advanced Filtering**: Sort and filter tasks by priority and status
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Updates**: Instant feedback with optimistic UI updates
- 🛡️ **Data Validation**: Comprehensive validation on both client and server
- 🔒 **Task Privacy**: Users can only access their own tasks

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT with secure HTTP-only cookies
- **State Management**: React hooks and context
- **Form Handling**: React Hook Form

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm package manager

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/adnan425/task-manager
cd task-manager
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://neondb_owner:npg_kohf2WpULz9a@ep-shy-sea-a41r6vji-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="fsfrr32fsfrew"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
# Generate Prisma client (with custom output path)
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

Note: The Prisma client is generated in `src/generated/prisma` as configured in the schema.

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### 6. Default Login Credentials

For testing purposes, you can use the following default credentials:

- **Email**: m.adnan6425@gmail.com
- **Password**: Adnan425@@

## Project Structure

```
task-manager/
├── app/                    # Next.js 15 app directory
│   ├── (auth)/            # Authentication pages
│   │   ├── sign-in/      # Login page
│   │   └── sign-up/      # Registration page
│   ├── api/              # API routes
│   │   ├── sign-in/      # Login API endpoint
│   │   ├── sign-up/      # Registration API endpoint
│   │   └── tasks/        # Tasks CRUD API endpoints
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── tasks/            # Task-related components
│   │   ├── TableHeader.tsx
│   │   ├── TableList.tsx
│   │   └── TaskForm.tsx
│   └── ui/               # Shadcn UI components
│       └── Header.tsx
├── generated/            # Generated files
│   └── prisma/          # Prisma client
├── hooks/                # Custom React hooks
│   ├── auth/            # Authentication hooks
│   ├── useSignIn.ts
│   ├── useSignUp.ts
│   └── useTasks.ts      # Tasks management hook
├── lib/                  # Utility functions and configurations
│   ├── axiosInstance.ts  # Axios configuration
│   ├── config.ts         # App configuration
│   ├── logoutAction.ts   # Logout server action
│   ├── prisma.ts        # Prisma client instance
│   ├── utils.ts         # Utility functions
│   └── withAuth.ts      # Authentication middleware
├── prisma/              # Database schema and migrations
│   └── schema.prisma    # Prisma schema definition
├── schemas/             # Zod validation schemas
└── middlewares/         # Middleware functions
```

## API Endpoints

### Authentication

- `POST /api/sign-up` - User registration
- `POST /api/sign-in` - User login

### Tasks

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/[id]` - Update a specific task
- `DELETE /api/tasks/[id]` - Delete a specific task

## Key Features Implementation

### Authentication

- JWT tokens stored in HTTP-only cookies
- Secure password hashing with bcrypt
- Protected routes with middleware

### Data Validation

- Zod schemas for request validation
- Client-side form validation
- Server-side data integrity checks

### Task Management

- Real-time updates with optimistic UI
- Advanced filtering and sorting
- Pagination for large datasets

## Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed password
  firstName String
  lastName  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  Task      Task[]
}
```

### Task Model

```prisma
model Task {
  id          String   @id @default(cuid())
  title       String
  description String
  priority    Priority
  status      Status
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}
```

### Enums

```prisma
enum Priority {
  low
  medium
  high
}

enum Status {
  pending
  completed
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Technical Decisions and Trade-offs

1. **Next.js 15 with App Router**: Chosen for its excellent developer experience, built-in API routes, and server-side rendering capabilities.

2. **Prisma ORM**: Selected for its type safety, excellent TypeScript integration, and ease of use with PostgreSQL.

3. **Shadcn/ui**: Provides accessible, customizable components that integrate well with Tailwind CSS.

4. **Zod Validation**: Enables consistent validation across client and server with TypeScript integration.

5. **JWT Authentication**: Offers a stateless authentication solution that scales well.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- Prisma team for the excellent ORM
