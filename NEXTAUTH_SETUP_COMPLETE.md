# NextAuth Setup Complete! ✅

## What Was Configured

### 1. Packages Installed
- ✅ `next-auth@beta` (v5.0.0-beta.29)
- ✅ `bcryptjs` (password hashing)
- ✅ `@types/bcryptjs` (TypeScript types)

### 2. Files Created/Modified

**Authentication Core:**
- ✅ `user/lib/auth.ts` - NextAuth configuration with Credentials provider
- ✅ `user/lib/auth-client.tsx` - Client-side hooks (re-exports from next-auth/react)
- ✅ `user/app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- ✅ `user/types/next-auth.d.ts` - TypeScript declarations for session user.id

**Environment:**
- ✅ `user/.env.local` - Added NEXTAUTH_SECRET and NEXTAUTH_URL
- ✅ `user/.env.local.example` - Template for other developers

**UI:**
- ✅ `user/app/login/page.tsx` - Sign-in page with form
- ✅ `user/app/layout.tsx` - Already wrapped with SessionProvider

### 3. Environment Variables Added

```env
NEXTAUTH_SECRET=mpmWC08oUojCj7rO4yKGWeuzcWxGDotuGiXXNHFs3FY=
NEXTAUTH_URL=http://localhost:3004
```

---

## How to Use

### Sign In (Client-Side)

```typescript
import { signIn } from 'next-auth/react';

// Sign in with credentials
await signIn('credentials', {
  email: 'user@example.com',
  password: 'password123',
  redirect: false, // or true to auto-redirect
});
```

### Sign Out

```typescript
import { signOut } from 'next-auth/react';

await signOut({ 
  redirect: true, 
  callbackUrl: '/' 
});
```

### Get Session (Client-Side)

```typescript
'use client';
import { useSession } from '@/lib/auth-client';

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Not signed in</div>;
  
  return <div>Signed in as {session?.user?.email}</div>;
}
```

### Get Session (Server-Side)

```typescript
import { getServerSession, authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession();
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const userId = session.user.id; // ✅ TypeScript knows about 'id'
  // ... rest of your code
}
```

---

## Testing Authentication

### 1. Start the User App

```bash
cd user
pnpm dev
```

Should start on http://localhost:3004

### 2. Create a Test User (MongoDB)

You need a user in your MongoDB database with a hashed password:

```javascript
// Run this in MongoDB shell or use a script
const bcrypt = require('bcryptjs');
const hashedPassword = bcrypt.hashSync('testpassword', 10);

db.users.insertOne({
  name: 'Test User',
  email: 'test@example.com',
  password: hashedPassword, // $2a$10$...
  createdAt: new Date(),
});
```

### 3. Sign In

Navigate to: http://localhost:3004/login

**Credentials:**
- Email: `test@example.com`
- Password: `testpassword`

### 4. Verify Session

After signing in, you should be redirected to the dashboard. Check browser DevTools:

**Application → Cookies:**
- Should see `next-auth.session-token` cookie

**Network Tab:**
- `/api/auth/session` should return your user data

---

## Protected Routes

### Example: Protect an API Route

```typescript
// user/app/api/protected/route.ts
import { getServerSession, authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return NextResponse.json({
    message: 'Protected data',
    userId: session.user.id,
  });
}
```

### Example: Protect a Page

```typescript
// user/app/protected/page.tsx
'use client';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/protected');
    }
  }, [status, router]);
  
  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return null;
  
  return <div>Protected Content</div>;
}
```

---

## Current API Routes Using Auth

All these routes are now fully secured with NextAuth:

✅ `POST/GET /api/courses/[id]/enroll` - Course enrollment
✅ `GET/PUT /api/progress/[courseId]` - Progress tracking
✅ `GET/POST /api/courses/[id]/reviews` - Course reviews
✅ `GET/POST /api/lessons/[id]/questions` - Lesson Q&A
✅ `GET /api/enrollments` - User enrollments

They all use:
```typescript
import { getServerSession, authOptions } from '@/lib/auth';

const session = await getServerSession();
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## Troubleshooting

### ❌ "NEXTAUTH_SECRET not set"
**Fix:** Make sure `user/.env.local` has `NEXTAUTH_SECRET` defined

### ❌ "Invalid credentials"
**Fix:** Check that:
1. User exists in MongoDB
2. Password is hashed with bcrypt (not plain text)
3. Email matches exactly

### ❌ Session not persisting
**Fix:**
1. Check cookies are enabled in browser
2. Verify `NEXTAUTH_URL` matches your app URL
3. Check browser console for errors

### ❌ TypeScript error: "user.id does not exist"
**Fix:** Restart TypeScript server
- VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

---

## Production Checklist

Before deploying:

- [ ] Generate new `NEXTAUTH_SECRET` for production
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Add rate limiting to login endpoint
- [ ] Implement account lockout after failed attempts
- [ ] Add password reset functionality
- [ ] Enable email verification
- [ ] Add 2FA (optional but recommended)

---

## Next Steps

1. **Create test user in MongoDB**
2. **Test login at** http://localhost:3004/login
3. **Verify enrollment APIs work** (try enrolling in a course)
4. **Check progress tracking** (complete a lesson)
5. **Submit a review** (requires 20% progress)

---

## Additional Providers (Optional)

Want to add Google/GitHub sign-in?

```bash
pnpm add @auth/mongodb-adapter
```

Then update `user/lib/auth.ts`:

```typescript
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongodb';

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  // ... existing CredentialsProvider
],
adapter: MongoDBAdapter(clientPromise),
```

---

## Support

- NextAuth Docs: https://next-auth.js.org
- Migration Guide (v4→v5): https://authjs.dev/guides/upgrade-to-v5
- Credentials Provider: https://next-auth.js.org/providers/credentials
