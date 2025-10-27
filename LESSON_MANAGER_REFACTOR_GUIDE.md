# Lesson Manager Refactoring - Implementation Guide

## Current Issues
1. ❌ Mock data instead of real database
2. ❌ "Premium Content" toggle (should inherit from course)
3. ❌ Limited code languages (only 5, need 40+)
4. ❌ No Cloudinary integration for videos/files
5. ❌ No bulk quiz import feature
6. ❌ Add code snippet button doesn't work properly

## ✅ Completed
- Updated Lesson model schema with all required fields
- Created API endpoints: PUT /api/lessons/[id] and DELETE /api/lessons/[id]
- GET and POST endpoints already exist at /api/courses/[id]/lessons

## 🔧 Required Changes

### 1. Database Integration

**Replace mock data with API calls:**

```typescript
// Fetch courses on mount
useEffect(() => {
  fetchCourses()
}, [])

const fetchCourses = async () => {
  const response = await fetch('/api/courses')
  const data = await response.json()
  setCourses(data.courses || [])
}

// Fetch lessons when course selected
const fetchLessons = async (courseId: string) => {
  const response = await fetch(`/api/courses/${courseId}/lessons`)
  const data = await response.json()
  setLessons(data.lessons || [])
}

// Save lesson (create or update)
const handleSaveLesson = async () => {
  const method = editingLesson ? 'PUT' : 'POST'
  const url = editingLesson 
    ? `/api/lessons/${editingLesson._id}`
    : `/api/courses/${lessonForm.courseId}/lessons`
    
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lessonData)
  })
  
  await fetchLessons(lessonForm.courseId) // Refresh
}

// Delete lesson
const handleDeleteLesson = async (lesson: Lesson) => {
  await fetch(`/api/lessons/${lesson._id}`, { method: 'DELETE' })
  await fetchLessons(lesson.courseId) // Refresh
}
```

### 2. Remove Premium Content Toggle

**Before:**
```typescript
<div>
  <Label>Access Type</Label>
  <Select value={accessType} onValueChange={setAccessType}>
    <SelectItem value="Free">Free</SelectItem>
    <SelectItem value="Premium">Premium</SelectItem>
  </Select>
</div>
```

**After:**
```typescript
// Remove completely - lessons inherit from course.price
// If course.price === 0, all lessons are free
// If course.price > 0, all lessons are premium
```

### 3. Cloudinary Video Upload

**Update video upload section:**

```typescript
const handleVideoUpload = async (file: File) => {
  if (file.size > 100 * 1024 * 1024) {
    alert('Video must be less than 100MB')
    return
  }
  
  setUploading(true)
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'video')
    
    const response = await fetch('/api/upload-cloudinary', {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    if (data.success) {
      setLessonForm({ ...lessonForm, videoUrl: data.url })
      alert('Video uploaded successfully!')
    }
  } catch (error) {
    alert('Upload failed: ' + error.message)
  } finally {
    setUploading(false)
  }
}
```

**Video section UI:**
```tsx
<TabsContent value="video">
  <div className="space-y-4">
    <div>
      <Label>Video Type</Label>
      <div className="flex gap-4 mt-2">
        <Button
          type="button"
          variant={lessonForm.videoType === 'upload' ? 'default' : 'outline'}
          onClick={() => setLessonForm({ ...lessonForm, videoType: 'upload' })}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload to Cloudinary
        </Button>
        <Button
          type="button"
          variant={lessonForm.videoType === 'youtube' ? 'default' : 'outline'}
          onClick={() => setLessonForm({ ...lessonForm, videoType: 'youtube' })}
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          YouTube URL
        </Button>
      </div>
    </div>

    {lessonForm.videoType === 'upload' ? (
      <div>
        <Label>Upload Video (Max 100MB)</Label>
        <Input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleVideoUpload(file)
          }}
        />
      </div>
    ) : (
      <div>
        <Label>YouTube URL</Label>
        <Input
          value={lessonForm.youtubeUrl}
          onChange={(e) => setLessonForm({ ...lessonForm, youtubeUrl: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
    )}
  </div>
</TabsContent>
```

### 4. Expand Code Languages

```typescript
const PROGRAMMING_LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Ruby', 'Go', 'Rust',
  'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Haskell', 'Lua', 'Dart',
  'HTML', 'CSS', 'SCSS', 'LESS', 'SQL', 'GraphQL', 'JSON', 'XML', 'YAML', 'Markdown',
  'Shell', 'Bash', 'PowerShell', 'Objective-C', 'Assembly', 'COBOL', 'Fortran', 'Ada',
  'Elixir', 'Erlang', 'F#', 'Clojure', 'Groovy', 'Julia', 'Solidity', 'Vue', 'Svelte'
]

// Use in dropdown
<Select value={snippet.language} onValueChange={(value) => updateCodeSnippet(index, 'language', value)}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="max-h-[300px]">
    {PROGRAMMING_LANGUAGES.map((lang) => (
      <SelectItem key={lang} value={lang}>
        {lang}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

### 5. Fix Code Snippet Functions

```typescript
const addCodeSnippet = () => {
  setLessonForm({
    ...lessonForm,
    codeSnippets: [...lessonForm.codeSnippets, { language: "JavaScript", code: "" }]
  })
}

const removeCodeSnippet = (index: number) => {
  setLessonForm({
    ...lessonForm,
    codeSnippets: lessonForm.codeSnippets.filter((_, i) => i !== index)
  })
}

const updateCodeSnippet = (index: number, field: 'language' | 'code', value: string) => {
  const updated = [...lessonForm.codeSnippets]
  updated[index] = { ...updated[index], [field]: value }
  setLessonForm({ ...lessonForm, codeSnippets: updated })
}
```

**UI Implementation:**
```tsx
<div className="space-y-4">
  {lessonForm.codeSnippets.map((snippet, index) => (
    <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Label>Code Snippet {index + 1}</Label>
        {lessonForm.codeSnippets.length > 1 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeCodeSnippet(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Select 
        value={snippet.language} 
        onValueChange={(value) => updateCodeSnippet(index, 'language', value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {PROGRAMMING_LANGUAGES.map((lang) => (
            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Textarea
        value={snippet.code}
        onChange={(e) => updateCodeSnippet(index, 'code', e.target.value)}
        placeholder="Paste your code here..."
        className="font-mono text-sm min-h-[200px]"
      />
    </div>
  ))}
  
  <Button type="button" variant="outline" onClick={addCodeSnippet}>
    <Plus className="mr-2 h-4 w-4" />
    Add Code Snippet
  </Button>
</div>
```

### 6. Cloudinary File Attachments

```typescript
const handleFileUpload = async (files: FileList) => {
  setUploading(true)
  try {
    const uploadedFiles = []
    
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'document')
      
      const response = await fetch('/api/upload-cloudinary', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      if (data.success) {
        uploadedFiles.push({
          name: file.name,
          url: data.url,
          type: file.type
        })
      }
    }
    
    setLessonForm({
      ...lessonForm,
      attachments: [...lessonForm.attachments, ...uploadedFiles]
    })
    
    alert(`${uploadedFiles.length} file(s) uploaded successfully!`)
  } catch (error) {
    alert('Upload failed: ' + error.message)
  } finally {
    setUploading(false)
  }
}
```

### 7. Bulk Quiz Import

**Expected Format:**
```
Q1: What is React?
A) A database
B) A JavaScript library
C) A programming language
D) An operating system
Answer: B

Q2: What is JSX?
A) A programming language
B) A syntax extension for JavaScript
C) A database
D) A framework
Answer: B
```

**Parser Function:**
```typescript
const parseBulkQuiz = () => {
  const text = lessonForm.bulkQuizText.trim()
  if (!text) return

  try {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l)
    const quizzes: { question: string; options: string[]; correctAnswer: number }[] = []
    
    let currentQuestion = ""
    let currentOptions: string[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]
      
      // Question line (Q1:, Q2:, etc)
      if (line.match(/^Q\d+:/i)) {
        currentQuestion = line.replace(/^Q\d+:\s*/i, '')
        currentOptions = []
        i++
        continue
      }

      // Option line (A), B), C), D))
      if (line.match(/^[A-D]\)/i)) {
        const option = line.replace(/^[A-D]\)\s*/i, '')
        currentOptions.push(option)
        i++
        continue
      }

      // Answer line
      if (line.match(/^Answer:/i)) {
        const answer = line.replace(/^Answer:\s*/i, '').trim().toUpperCase()
        let correctIndex = 0
        
        if (answer === 'A') correctIndex = 0
        else if (answer === 'B') correctIndex = 1
        else if (answer === 'C') correctIndex = 2
        else if (answer === 'D') correctIndex = 3

        if (currentQuestion && currentOptions.length >= 2) {
          while (currentOptions.length < 4) {
            currentOptions.push("")
          }
          
          quizzes.push({
            question: currentQuestion,
            options: currentOptions.slice(0, 4),
            correctAnswer: correctIndex
          })
        }

        currentQuestion = ""
        currentOptions = []
        i++
        continue
      }

      i++
    }

    if (quizzes.length > 0) {
      setLessonForm({ ...lessonForm, quizzes, bulkQuizText: "" })
      alert(`Successfully imported ${quizzes.length} quiz question(s)!`)
    } else {
      alert('No valid quizzes found. Please check the format.')
    }

  } catch (err) {
    console.error('Error parsing bulk quiz:', err)
    alert('Failed to parse quiz text. Please check the format.')
  }
}
```

**UI Implementation:**
```tsx
<TabsContent value="quizzes">
  <div className="space-y-6">
    {/* Bulk Import Option */}
    <div className="border border-purple-700 rounded-lg p-4 bg-purple-900/10">
      <h3 className="font-semibold text-white mb-2">Bulk Import Quizzes</h3>
      <p className="text-sm text-gray-400 mb-3">
        Paste your quiz in the format: Q1: Question? A) Option B) Option Answer: B
      </p>
      <Textarea
        value={lessonForm.bulkQuizText}
        onChange={(e) => setLessonForm({ ...lessonForm, bulkQuizText: e.target.value })}
        placeholder={"Q1: What is React?\nA) A database\nB) A JavaScript library\nC) A programming language\nD) An operating system\nAnswer: B"}
        className="min-h-[150px] mb-3"
      />
      <Button type="button" variant="outline" onClick={parseBulkQuiz}>
        Import Quizzes
      </Button>
    </div>

    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-700" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-gray-800 px-2 text-gray-400">Or add manually</span>
      </div>
    </div>

    {/* Manual Quiz Entry */}
    {lessonForm.quizzes.map((quiz, index) => (
      <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
        {/* ... existing manual quiz UI ... */}
      </div>
    ))}
    
    <Button type="button" variant="outline" onClick={addQuiz}>
      <Plus className="mr-2 h-4 w-4" />
      Add Quiz Question
    </Button>
  </div>
</TabsContent>
```

## Testing Checklist

Once implemented, test the following:

1. ✅ Create a new lesson
2. ✅ Upload video to Cloudinary
3. ✅ Add YouTube URL
4. ✅ Add multiple code snippets with different languages
5. ✅ Upload PDF/document files
6. ✅ Import bulk quizzes
7. ✅ Add manual quiz questions
8. ✅ Enable/disable AI Q&A
9. ✅ Edit existing lesson
10. ✅ Delete lesson
11. ✅ Verify lesson appears in database
12. ✅ Check all uploaded files are in Cloudinary

## File Structure

```
admin/
  app/
    api/
      courses/
        [id]/
          lessons/
            route.ts (GET, POST) ✅
      lessons/
        [id]/
          route.ts (PUT, DELETE) ✅
      upload-cloudinary/
        route.ts ✅ (already exists)
  components/
    courses/
      lesson-manager.tsx (needs full refactor)
      
shared/
  src/
    models/
      Lesson.ts ✅ (updated with new fields)
```

## Summary

The lesson manager needs a complete refactor to:
1. Connect to MongoDB instead of mock data
2. Integrate Cloudinary for all media uploads
3. Support 40+ programming languages
4. Add bulk quiz import feature
5. Remove premium toggle (inherit from course)
6. Fix all CRUD operations

Use the code snippets above as a reference for the implementation. The key is to replace the mock data with real API calls and add proper file upload handling throughout.
