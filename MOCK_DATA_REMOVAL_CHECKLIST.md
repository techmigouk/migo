# Mock Data Removal Checklist

This document lists all areas in the application that currently use mock/hardcoded data and need to be replaced with real data from the database or APIs.

## ✅ COMPLETED

### Admin - User Management
- **File:** `admin/components/user-management/user-directory.tsx`
- **Status:** ✅ DONE - Now fetches real users from `/api/users`
- **What was changed:** Removed mockUsers array, added useEffect to fetch from API, updated User interface to match database schema

## 🔴 NEEDS REAL DATA

### 1. Admin Dashboard - Stats Cards
**File:** `admin/components/admin-dashboard.tsx` (Lines 338-341)
**Current Mock Data:**
- Total Users: "12,543"
- Active Courses: "87"
- Revenue (MTD): "$45,230"
- Completion Rate: "68%"

**Action Required:**
1. Create API endpoint `/api/analytics/dashboard-stats`
2. Fetch real data:
   - Count total users from UserModel
   - Count published courses from CourseModel
   - Calculate revenue from subscriptions/transactions
   - Calculate average completion rate from user progress
3. Replace hardcoded values with API data

---

### 2. User Dashboard - All Mock Data
**File:** `user/app/page.tsx`

#### Mock User Stats (Lines 220-228)
```typescript
const mockUserStats: IUserStats = {
  userName: "Alex Thompson",
  userAvatarUrl: "/avatar.png",
  currentStreak: 7,
  totalPoints: 2450,
  subscriptionTier: "Free",
  learningHours: 42,
  skillsMastered: 8,
}
```
**Action:** Fetch from `/api/user/stats` endpoint

#### Mock Courses (Lines 230-272)
**Action:** Already being fetched from API - remove mock data completely

#### Mock Lessons (Lines 274-300)
**Action:** Create lessons API or fetch from course enrollment data

#### Mock Quiz Questions (Lines 302-329)
**Action:** Create quiz/assessment system in database

#### Mock Projects (Lines 331-352)
**Action:** Create projects collection in database

#### Mock Certificates (Lines 354-361)
**Action:** Create certificates collection, generate on course completion

#### Mock Notifications (Lines 363-396)
**Action:** Create notifications system in database

#### Mock Sessions (Lines 398-417)
**Action:** Create mentorship sessions collection

#### Mock Leaderboard (Lines 419-450)
**Action:** Calculate from user stats and course completions

#### Mock Marketplace Products (Lines 452-479)
**Action:** Create marketplace products collection

---

### 3. Front Page - Course Reviews
**File:** `front/app/courses/[id]/page.tsx` (Line 150)
```typescript
// Mock reviews for now - will be replaced with real API
```
**Action:** Create reviews collection and API endpoints

---

### 4. Admin - Live Events
**File:** `admin/components/user-management/live-events.tsx` (Lines 26-52)
**Action:** Create live events collection, integrate with calendar/streaming platform

---

### 5. Admin - Staff Directory
**File:** `admin/components/staff/staff-directory.tsx` (Lines 27-73)
**Action:** Create staff management system or fetch from UserModel with role=staff

---

### 6. Admin - Feature Flags
**File:** `admin/components/settings/feature-flags.tsx` (Lines 16-60)
**Action:** Create feature flags collection in database

---

### 7. Admin - Activity Logs
**File:** `admin/components/staff/activity-logs.tsx` (Lines 19-61)
**Action:** Create activity logging system, store all admin actions

---

### 8. Admin - API Keys
**File:** `admin/components/settings/api-settings.tsx` (Lines 22-40)
**Action:** Create API keys management system

---

### 9. Admin - Security & Compliance
**File:** `admin/components/security/security-compliance.tsx`
- **Audit Logs** (Lines 60-101)
- **Vulnerabilities** (Lines 103-140)
- **Compliance Reports** (Lines 142-147)
- **Privacy Requests** (Lines 149-156)

**Action:** Create security monitoring system, integrate GDPR compliance tools

---

### 10. Admin - RBAC Management
**File:** `admin/components/rbac/rbac-management.tsx` (Lines 33-88, 121-135)
**Action:** Create roles and permissions system in database

---

### 11. Admin - Marketing
**Files:**
- `admin/components/marketing/retention-engine.tsx` - Retention segments
- `admin/components/marketing/social-media-manager.tsx` - Social posts
- `admin/components/marketing/messaging-system.tsx` - Messages
- `admin/components/marketing/marketing-campaigns.tsx` - Campaigns
- `admin/components/marketing/crm-leads.tsx` - CRM leads

**Action:** Create marketing automation system or integrate with third-party tools

---

### 12. Admin - Mentorship
**Files:**
- `admin/components/mentorship/session-scheduling.tsx` - Sessions
- `admin/components/mentorship/session-history.tsx` - Historical sessions
- `admin/components/mentorship/mentor-reviews.tsx` - Mentor reviews
- `admin/components/mentorship/mentor-directory.tsx` - Mentors

**Action:** Create mentorship platform with scheduling, reviews, and directory

---

### 13. Admin - Financial
**Files:**
- `admin/components/financial/billing-management.tsx` - Subscriptions & transactions
- `admin/components/financial/marketplace-manager.tsx` - Marketplace products
- `admin/components/financial/referral-system.tsx` - Referral program

**Action:** Integrate with Stripe webhooks, create financial tracking system

---

## 📋 RECOMMENDATIONS

### Priority 1 (High Impact - Do First)
1. **Admin Dashboard Stats** - Shows real platform metrics
2. **User Dashboard Stats** - Personalized user experience
3. **Notifications System** - Essential for user engagement
4. **Certificates** - Important for course completion motivation

### Priority 2 (Core Features)
5. **Course Reviews** - Social proof for course pages
6. **Projects System** - Hands-on learning component
7. **Quiz/Assessment System** - Measure learning progress
8. **Activity Logs** - Admin oversight and security

### Priority 3 (Advanced Features)
9. **Mentorship Platform** - Premium feature
10. **Marketing Automation** - Growth and retention
11. **RBAC System** - Enterprise features
12. **Feature Flags** - A/B testing and gradual rollouts

---

## 🎯 HOW TO TEST YOUR CHANGES

After removing mock data and implementing real data fetching:

1. **Create Test Data:**
   - Sign up multiple test users
   - Create test courses with different statuses
   - Enroll test users in courses
   - Create test transactions/subscriptions
   - Add test content (projects, quizzes, etc.)

2. **Verify Data Display:**
   - Check admin dashboard shows accurate counts
   - Verify user dashboard displays user-specific data
   - Ensure filtering and search work correctly
   - Test edge cases (empty states, no data)

3. **Test Performance:**
   - Check page load times with real database queries
   - Monitor for N+1 query problems
   - Implement pagination where needed
   - Add loading states for all async operations

---

## 📝 NOTES

- All mock data arrays are marked with `const mock*` naming convention
- Use `grep_search` to find: `const mock|mockUsers|mockCourses|mockData`
- Remember to add error handling for all API calls
- Implement loading states for better UX
- Add empty states when no data exists
- Consider adding data caching where appropriate
