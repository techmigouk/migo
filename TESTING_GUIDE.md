# End-to-End Testing Guide - Course Learning Flow

## Prerequisites

Before testing, ensure:

1. **Shared package is built:**
```bash
cd shared
pnpm build
```

2. **User app is running:**
```bash
cd user
pnpm dev
```
Should start on http://localhost:3004

3. **MongoDB is connected** (check `user/.env.local` for `MONGODB_URI`)

4. **Authentication is set up** (see AUTHENTICATION_SETUP.md)

5. **Test data exists:**
   - At least 1 published course with lessons
   - Course should have: title, description, instructor, thumbnail
   - Lessons should have: title, description, order, videoUrl, content

---

## Test Scenarios

### 1. Browse Courses (Dashboard)

**URL:** `http://localhost:3004`

**Expected Behavior:**
- [ ] Courses load from `/api/courses` endpoint
- [ ] Each course card shows thumbnail, title, instructor
- [ ] **Status-based buttons appear:**
  - "View Course" for courses you haven't enrolled in
  - "Continue Learning" for enrolled courses (with progress bar)
  - "View Course" with completion badge for finished courses
  - "Upgrade to Unlock" for premium courses (if not subscribed)

**Test Actions:**
1. Open browser DevTools → Network tab
2. Load dashboard
3. Verify `/api/courses` and `/api/enrollments` requests succeed
4. Check that course progress percentages display correctly
5. Click "View Course" → should navigate to `/courses/[id]`

---

### 2. View Course Details

**URL:** `http://localhost:3004/courses/[courseId]`

**Expected Behavior:**
- [ ] Course details load from `/api/courses/[id]`
- [ ] Intro video plays (if `introVideo` field is set)
- [ ] "What You'll Learn" section displays checklist
- [ ] Course curriculum shows all lessons with order numbers
- [ ] **Enrollment status affects display:**
  - **Not enrolled:** Shows "Start Learning Now" button
  - **Enrolled:** Shows "Continue Learning" button + progress bar
  - **Completed:** Shows completion badge + "Continue Learning"
- [ ] Preview lessons show "Preview" badge
- [ ] Locked lessons show lock icon (if not enrolled)
- [ ] Reviews section displays (if reviews exist)
- [ ] Instructor bio appears in sidebar
- [ ] **Final Project section only appears if course is 100% complete**

**Test Actions:**
1. Click course from dashboard
2. Verify all sections load
3. Check enrollment button logic
4. Click "Start Learning Now" or "Continue Learning"
5. Should redirect to:
   - First lesson (if new enrollment)
   - Last accessed lesson (if continuing)

---

### 3. Enroll in Course

**API:** `POST /api/courses/[id]/enroll`

**Expected Behavior:**
- [ ] Clicking "Start Learning Now" creates enrollment
- [ ] User is redirected to first lesson
- [ ] Enrollment appears in `/api/enrollments` response
- [ ] Progress starts at 0%
- [ ] Status is "active"

**Test Actions:**
1. Click "Start Learning Now" on course details page
2. Check Network tab for `POST /api/courses/[id]/enroll`
3. Verify response: `{ enrolled: true, enrollment: {...} }`
4. Should redirect to `/courses/[courseId]/lessons/[firstLessonId]`
5. Go back to course list → button should now say "Continue Learning"

---

### 4. View Lesson (Learning Page)

**URL:** `http://localhost:3004/courses/[courseId]/lessons/[lessonId]`

**Expected Behavior:**
- [ ] Lesson details load from `/api/lessons/[id]`
- [ ] Video player displays if `videoUrl` exists
- [ ] Tabs show: Content, Code (if snippets), Resources (if files), Quiz (if exists), Q&A
- [ ] **Content tab:**
  - Displays lesson content (HTML/Markdown)
  - Shows "Mark as Complete" button (if no quiz)
- [ ] **Code tab:**
  - Shows code snippets with language badges
  - Syntax-highlighted code blocks
- [ ] **Resources tab:**
  - Lists downloadable files
  - Shows file type badges
  - Links open in new tab
- [ ] **Quiz tab:**
  - Displays quiz questions
  - Shows passing score (e.g., "Passing score: 70%")
  - Radio buttons for multiple choice
  - "Submit Quiz" button (disabled until all answered)
- [ ] **Lesson Sidebar:**
  - Lists all course lessons
  - Current lesson highlighted in blue
  - Completed lessons have green checkmark
  - Locked lessons have lock icon
  - Sequential unlocking enforced

**Test Actions:**
1. Navigate to first lesson
2. Play video (should track completion)
3. Switch between all tabs
4. Check sidebar:
   - First lesson should be highlighted
   - Next lesson should be unlocked
   - Future lessons should be locked
5. Click "Previous"/"Next" buttons

---

### 5. Take Quiz

**Expected Behavior:**
- [ ] Quiz questions display
- [ ] Can select one option per question
- [ ] "Submit Quiz" button disabled until all questions answered
- [ ] After submission:
  - **Pass (≥70%):** Green success message, "Next Lesson" unlocks
  - **Fail (<70%):** Red failure message, "Retry Quiz" button appears
- [ ] Quiz score saved to `/api/progress/[courseId]`
- [ ] Lesson auto-marks complete on quiz pass
- [ ] Progress percentage updates

**Test Actions:**
1. Go to lesson with quiz
2. Answer all questions (try wrong answers first)
3. Submit quiz
4. If failed:
   - Click "Retry Quiz"
   - Answer correctly
   - Submit again
5. Verify pass state:
   - Check green success message
   - Verify lesson marked complete in sidebar
   - Confirm next lesson unlocked
6. Check Network tab:
   - `PUT /api/progress/[courseId]` should include `quizScores: { [lessonId]: score }`

---

### 6. Progress Tracking

**API:** `GET /api/progress/[courseId]`

**Expected Behavior:**
- [ ] Progress auto-calculates: `(completedLessons.length / totalLessons) * 100`
- [ ] Last accessed lesson updates on each lesson view
- [ ] Completed lessons array grows as lessons finish
- [ ] Quiz scores stored per lesson
- [ ] Status changes to "completed" at 100%

**Test Actions:**
1. Complete first lesson
2. Check `/api/progress/[courseId]` response:
```json
{
  "enrollment": {
    "progress": 33,  // If 1 of 3 lessons done
    "completedLessons": ["lessonId1"],
    "lastAccessedLessonId": "lessonId1",
    "quizScores": { "lessonId1": 85 }
  },
  "totalLessons": 3
}
```
3. Go back to course details → progress bar should show 33%
4. Go to dashboard → course card should show 33%

---

### 7. Lesson Locking Logic

**Expected Behavior:**
- [ ] Lesson 1 always unlocked
- [ ] Lesson 2 locked until Lesson 1 completed
- [ ] Lesson 3 locked until Lesson 2 completed
- [ ] Clicking locked lesson does nothing
- [ ] "Next Lesson" button disabled if next lesson locked
- [ ] Lock icon displays on locked lessons in sidebar

**Test Actions:**
1. Enroll in fresh course
2. Go to first lesson
3. Check sidebar:
   - Lesson 1: Highlighted (current)
   - Lesson 2: No lock (unlocked but not completed)
   - Lesson 3+: Lock icon (locked)
4. Complete Lesson 1 (mark complete or pass quiz)
5. Verify Lesson 2 now clickable
6. Try clicking Lesson 3 → should still be locked
7. Complete Lesson 2
8. Verify Lesson 3 unlocks

---

### 8. Continue Learning Redirect

**Expected Behavior:**
- [ ] Dashboard "Continue Learning" → redirects to course details
- [ ] Course details "Continue Learning" → redirects to last accessed lesson
- [ ] Correct lesson opens based on `lastAccessedLessonId`

**Test Actions:**
1. Start course, view Lesson 2
2. Go back to dashboard
3. Click "Continue Learning" on course card
4. Should redirect to course details page
5. Click "Continue Learning" button
6. Should redirect to Lesson 2 (not Lesson 1)
7. Check Network tab: `/api/progress/[courseId]` fetches `lastAccessedLessonId`

---

### 9. Course Completion & Project Visibility

**Expected Behavior:**
- [ ] Completing all lessons sets `status: 'completed'`
- [ ] Progress reaches 100%
- [ ] **Final Project section appears** (only at 100%)
- [ ] Project shows:
  - Congratulations message
  - Project title and description
  - Project media (video or image)
  - "Download Project Files" button
- [ ] Dashboard shows "View Course" button with completion badge

**Test Actions:**
1. Complete all lessons in a course
2. Verify progress API: `{ progress: 100, status: 'completed' }`
3. Go to course details page
4. Scroll down → Final Project section should be visible
5. Verify project content displays
6. Go to dashboard → course should show completion badge
7. Unenroll from course (manually delete enrollment in DB)
8. Reload course details → Final Project section should disappear

---

### 10. Course Reviews

**API:** `POST /api/courses/[id]/reviews`

**Expected Behavior:**
- [ ] Review section displays existing reviews
- [ ] Can only submit review if enrolled AND ≥20% progress
- [ ] One review per user per course
- [ ] 5-star rating system
- [ ] Comment between 10-1000 characters
- [ ] Reviews display with user name, avatar, rating, comment, date

**Test Actions:**
1. Enroll in course but don't complete any lessons
2. Try to submit review → should get error: "Must complete at least 20% of the course"
3. Complete 1 lesson (if course has 3+ lessons, you'll have ≥33% progress)
4. Submit review with 4 stars and comment
5. Verify review appears at bottom of course details page
6. Try submitting another review → should get error: "You have already reviewed this course"
7. Check average rating updates on course card

---

### 11. Lesson Q&A (Placeholder)

**API:** `POST /api/lessons/[id]/questions`

**Expected Behavior:**
- [ ] Q&A tab displays
- [ ] Shows "Q&A section coming soon" placeholder
- [ ] Backend API exists and works

**Test Actions:**
1. Go to any lesson
2. Click Q&A tab
3. Verify placeholder message
4. (Optional) Test API manually:
```bash
curl -X POST http://localhost:3004/api/lessons/[lessonId]/questions \
  -H "Content-Type: application/json" \
  -d '{"question": "How does this work?"}'
```

---

## Database Verification

### Check Enrollments
```bash
# MongoDB shell or Compass
db.usercourseenrollments.find().pretty()
```

Expected fields:
- `userId`: User ObjectId
- `courseId`: Course ObjectId
- `enrolledAt`: Date
- `progress`: Number (0-100)
- `status`: "active" | "completed" | "paused" | "dropped"
- `completedLessons`: Array of lesson IDs
- `quizScores`: Map of lessonId → score
- `lastAccessedLessonId`: Lesson ObjectId
- `lastAccessedAt`: Date

### Check Reviews
```bash
db.coursereviews.find().pretty()
```

Expected fields:
- `userId`, `courseId`
- `rating`: 1-5
- `comment`: String
- `helpful`: Array of user IDs
- `createdAt`: Date

### Check Questions
```bash
db.lessonquestions.find().pretty()
```

Expected fields:
- `lessonId`, `userId`
- `question`: String
- `answers`: Array of answer objects
- `upvotes`: Array of user IDs

---

## Common Issues & Fixes

### ❌ "Cannot find module '@/lib/auth'"
**Fix:** TypeScript language server needs reload
- VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### ❌ Courses not loading
**Fix:** 
1. Check MongoDB connection in `user/.env.local`
2. Verify `MONGODB_URI` is correct
3. Check Network tab for `/api/courses` error

### ❌ Enrollment fails with 401
**Fix:** Authentication not set up
- See `AUTHENTICATION_SETUP.md`
- Install NextAuth or use placeholder with manual session cookie

### ❌ Progress not updating
**Fix:**
1. Check `/api/progress/[courseId]` Network request
2. Verify `completedLessons` array in DB
3. Ensure `PUT` request includes lesson ID

### ❌ Lessons not unlocking
**Fix:**
1. Check `completedLessons` array in enrollment document
2. Verify `isLessonCompleted()` function in lesson page
3. Ensure previous lesson is marked complete

### ❌ Quiz not submitting
**Fix:**
1. Check all questions are answered
2. Verify `lesson.quiz` exists in lesson document
3. Check Network tab for errors

---

## Success Criteria ✅

Course Learning Flow is complete when:

- ✅ User can browse courses with enrollment status
- ✅ User can enroll in a course
- ✅ Progress tracking works (0% → 100%)
- ✅ Lessons unlock sequentially
- ✅ Quizzes prevent progression until passed
- ✅ "Continue Learning" redirects to last accessed lesson
- ✅ Course completion shows final project
- ✅ Reviews can be submitted (with 20% progress requirement)
- ✅ All API endpoints return correct data
- ✅ No console errors
- ✅ Database updates correctly

---

## Performance Checklist

- [ ] API responses < 500ms
- [ ] No N+1 query problems
- [ ] Proper MongoDB indexes on:
  - `UserCourseEnrollment`: `userId + courseId` (unique)
  - `CourseReview`: `userId + courseId` (unique)
  - `LessonQuestion`: `lessonId`
- [ ] Lesson list uses `.lean()` for performance
- [ ] Progress calculation is efficient

---

## Next Steps After Testing

1. **Fix any bugs found**
2. **Add loading states** for better UX
3. **Add error boundaries** for graceful failures
4. **Implement actual Q&A UI** (replace placeholder)
5. **Add certificate generation** for completed courses
6. **Set up proper authentication** (NextAuth recommended)
7. **Deploy to production** (Vercel, etc.)
