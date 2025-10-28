# Development Guidelines for TechMigo Project

## ⚠️ CRITICAL INSTRUCTIONS - DO NOT MODIFY

### User-Side Course Enrollment System
**Status: LOCKED - Do not change without explicit permission**

The user-side course enrollment functionality is finalized and should **NOT** be modified. This includes:

#### Protected Components:
1. **Enrollment API Endpoints**
   - `/api/enrollments` - User enrollment tracking
   - `/api/courses/${courseId}/enroll` - Course enrollment endpoint
   - Keep all current logic and database queries as-is

2. **Course Browsing & Filtering**
   - `user/app/courses/page.tsx` - Main courses catalog page
   - Course search functionality
   - Category filtering (dynamically generated from database)
   - Price filtering (Free/Pro)
   - Level filtering

3. **Enrollment Status System**
   - `enrolled` - User is enrolled and learning
   - `preview` - Free courses or Pro user accessing paid content
   - `locked` - Paid course, user needs to upgrade
   - `completed` - User finished the course

4. **Course Display Logic**
   - Course grid layout
   - Enrollment modal with course preview
   - Progress tracking integration
   - MongoDB real-time data fetching

#### Technical Requirements:
- **Authentication**: JWT-based (NOT next-auth)
- **Database**: MongoDB Atlas cloud connection
- **Shared Models**: Import from `@amigo/shared` package
- **ID Convention**: Use `courseId` consistently (not `id` or `_id`)

---

## Project Architecture (Do Not Change)

### Authentication System
- **Type**: JSON Web Token (JWT)
- **Storage**: localStorage
- **Flow**: 
  1. User logs in via `/api/auth/login`
  2. Server returns JWT token + user data
  3. Token stored in localStorage
  4. Token sent in Authorization header for API calls

**⚠️ DO NOT install or use next-auth package**

### Database Configuration
- **Provider**: MongoDB Atlas (Cloud)
- **Connection String**: Stored in `.env.local` files
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/amigo_db`

**All three apps must use the same MongoDB Atlas connection:**
- `admin/.env.local`
- `front/.env.local`
- `user/.env.local`

### Monorepo Structure
```
migo/
├── admin/          # Admin dashboard (Port 3001)
├── front/          # Landing/marketing site (Port 3000)
├── user/           # Student learning platform (Port 3004)
├── shared/         # Shared models and utilities
└── tests/          # Playwright tests
```

**Important**: The `shared` package must be built before use:
```bash
cd shared
pnpm build
```

### Package Management
- **Tool**: pnpm (with Turborepo)
- **Dev Command**: `pnpm dev` (runs all apps)
- **Workspace**: Uses pnpm workspaces

---

## Course ID Convention

**Always use `courseId` throughout the codebase:**
- ✅ `course.courseId`
- ❌ `course.id`
- ❌ `course._id` (except when mapping from database)

**Database Mapping**:
```typescript
const mappedCourses = (coursesData.courses || []).map((course: any) => ({
  ...course,
  courseId: course._id // Map _id to courseId
}))
```

---

## Common Commands

### Start Development Servers
```bash
cd C:\Users\Lovin\migo
pnpm dev
```

### Stop All Node Processes
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
```

### Build Shared Package
```bash
cd shared
pnpm build
```

### Git Operations
```bash
git add .
git commit -m "Your message"
git push origin main
```

---

## Performance Optimizations Applied

### API Route Optimizations (Do Not Remove)
- `.lean()` - Mongoose queries return plain objects (faster)
- `.maxTimeMS()` - Query timeout limits
- `.limit(100)` - Prevent large result sets
- `revalidate` - API route caching

### Example (Keep This Pattern):
```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

const courses = await CourseModel.find({ status: 'published' })
  .populate('instructor', 'name email avatar')
  .lean()
  .limit(100)
  .maxTimeMS(5000);
```

---

## Environment Variables

### Required in All Apps (.env.local)
```bash
MONGODB_URI=mongodb+srv://techmigouk_db_user:peDzbQUMxBxJhM5j@techmigo.t4bbyoi.mongodb.net/amigo_db?retryWrites=true&w=majority
JWT_SECRET=your-secure-jwt-secret-key
NODE_ENV=development
```

---

## Troubleshooting

### "Module not found" Errors
1. Rebuild shared package: `cd shared && pnpm build`
2. Clear Next.js cache: Delete `.next` folders
3. Reinstall dependencies: `pnpm install`

### Slow Database Queries
- Check MongoDB Atlas connection
- Verify MONGODB_URI is set correctly in all apps
- Check console for timing logs: `[Courses API] Found X courses in XXX ms`

### Build Errors
1. Stop all processes
2. Rebuild shared: `cd shared && pnpm build`
3. Restart: `pnpm dev`

---

## Contact & Support
- Repository: techmigouk/migo
- Branch: main
- Last Updated: October 28, 2025

---

**Remember**: When in doubt, keep the current implementation. Changes to core enrollment functionality require explicit approval.
