# Authentication Setup Guide

## Current State
The project uses a **placeholder authentication system** that is **NOT SECURE** for production. It's only there to allow the enrollment/progress APIs to compile.

## Option 1: NextAuth (Recommended) ⭐

NextAuth is the most popular authentication library for Next.js with built-in support for many providers.

### Installation

```bash
cd user
pnpm add next-auth@beta bcryptjs
pnpm add -D @types/bcryptjs
```

### Setup Steps

1. **Add Environment Variable** to `user/.env.local`:
```env
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3004
```

Generate secret:
```bash
openssl rand -base64 32
```

2. **Update `user/lib/auth.ts`**:
   - Uncomment the NextAuth implementation (lines 3-71)
   - Delete the placeholder section (lines 73-99)

3. **Update `user/lib/auth-client.tsx`**:
   - Replace entire file with:
   ```typescript
   'use client';
   export { SessionProvider, useSession } from 'next-auth/react';
   ```

4. **Update `user/app/layout.tsx`**:
   - Change import to: `import { SessionProvider } from 'next-auth/react'`

5. **API Route Already Created**: `user/app/api/auth/[...nextauth]/route.ts`

6. **Add TypeScript Declarations** to `user/next-env.d.ts`:
```typescript
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      avatar?: string
    }
  }
}
```

### Usage

**Sign In:**
```typescript
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  email: 'user@example.com',
  password: 'password123',
  redirect: false,
});
```

**Sign Out:**
```typescript
import { signOut } from 'next-auth/react';
await signOut({ redirect: true, callbackUrl: '/' });
```

**Get Session (Client):**
```typescript
import { useSession } from 'next-auth/react';

const { data: session, status } = useSession();
if (status === 'authenticated') {
  console.log(session.user.id);
}
```

**Get Session (Server):**
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const session = await getServerSession(authOptions);
```

---

## Option 2: Clerk (Easiest Setup) 🚀

Clerk provides managed authentication with a hosted UI.

### Installation

```bash
cd user
pnpm add @clerk/nextjs
```

### Setup Steps

1. **Sign up at** https://clerk.com

2. **Add Environment Variables** to `user/.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

3. **Update `user/app/layout.tsx`**:
```typescript
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

4. **Update `user/middleware.ts`**:
```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

5. **Replace Auth Files**:
   - Delete `user/lib/auth.ts` and `user/lib/auth-client.tsx`
   - Update all API imports to use Clerk's `auth()` function

**Get User (Server):**
```typescript
import { auth } from '@clerk/nextjs/server';

const { userId } = await auth();
```

**Get User (Client):**
```typescript
import { useUser } from '@clerk/nextjs';

const { user, isLoaded } = useUser();
```

---

## Option 3: Custom JWT (Advanced) 🔐

For full control, implement custom JWT authentication.

### Installation

```bash
cd user
pnpm add jsonwebtoken bcryptjs
pnpm add -D @types/jsonwebtoken @types/bcryptjs
```

### Key Components Needed

1. **Login API** (`/api/auth/login`):
   - Verify credentials
   - Generate JWT token
   - Set httpOnly cookie

2. **Logout API** (`/api/auth/logout`):
   - Clear auth cookie

3. **Middleware** (`middleware.ts`):
   - Verify JWT on protected routes
   - Attach user to request

4. **Session Hook**:
   - Read session from cookie
   - Refresh token when expired

---

## Current Placeholder Behavior

**What the placeholder does:**
- ✅ Allows code to compile
- ✅ Provides type-safe interfaces
- ❌ No actual login/logout
- ❌ No password verification
- ❌ No token signing/encryption
- ❌ Cookies can be tampered with
- ❌ NOT production-ready

**Files using auth:**
- `user/app/api/courses/[id]/enroll/route.ts`
- `user/app/api/progress/[courseId]/route.ts`
- `user/app/api/courses/[id]/reviews/route.ts`
- `user/app/api/lessons/[id]/questions/route.ts`
- `user/app/api/enrollments/route.ts`
- `user/app/courses/[id]/page.tsx`
- `user/app/courses/[courseId]/lessons/[lessonId]/page.tsx`

All these files will work once you implement one of the above options.

---

## Recommended: NextAuth

**Why NextAuth?**
- ✅ Built for Next.js
- ✅ Supports multiple providers (Google, GitHub, Email, etc.)
- ✅ JWT + Database sessions
- ✅ TypeScript support
- ✅ Active community
- ✅ Works with your existing MongoDB setup

**Quick Start:**
```bash
cd user
pnpm add next-auth@beta bcryptjs @types/bcryptjs
```

Then uncomment the NextAuth code in `user/lib/auth.ts` and update `user/lib/auth-client.tsx` as shown above.
