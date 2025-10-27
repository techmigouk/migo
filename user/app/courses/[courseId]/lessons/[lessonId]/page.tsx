'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Lock,
  FileDown,
  MessageSquare,
  Code,
  Loader2,
  PlayCircle,
  Send,
  ThumbsUp,
  Download,
  ExternalLink,
  BookOpen,
  Award,
  Trophy,
  Clock,
  Star,
  Sparkles
} from 'lucide-react';

interface Lesson {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  videoUrl?: string;
  content?: string;
  codeSnippets?: Array<{
    language: string;
    code: string;
    title?: string;
  }>;
  resources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  quiz?: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
    }>;
    passingScore: number;
  };
  duration?: string;
  isPreview?: boolean;
}

interface Question {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  question: string;
  answers: Array<{
    userId: {
      _id: string;
      name: string;
      avatar?: string;
    };
    answer: string;
    createdAt: string;
    isInstructor: boolean;
  }>;
  upvotes: string[];
  createdAt: string;
}

interface Progress {
  enrollment: {
    progress: number;
    completedLessons: string[];
    lastAccessedLessonId: string;
    quizScores: Record<string, number>;
    status: string;
  };
  lessons: Lesson[];
  totalLessons: number;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [showQuizLockModal, setShowQuizLockModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [attemptingNextLesson, setAttemptingNextLesson] = useState<Lesson | null>(null);

  const courseId = params?.courseId as string;
  const lessonId = params?.lessonId as string;

  // Video protection: Disable right-click and keyboard shortcuts
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent DevTools shortcuts on video
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U') ||
        e.key === 'F12'
      ) {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.tagName === 'VIDEO') {
          e.preventDefault();
          return false;
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (courseId && lessonId) {
      fetchLessonData();
      fetchQuestions();
    }
  }, [courseId, lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);

      // Fetch lesson details
      const lessonRes = await fetch(`/api/lessons/${lessonId}`);
      const lessonData = await lessonRes.json();
      
      console.log('📚 Fetched lesson data:', {
        lessonId,
        title: lessonData.title,
        hasQuiz: !!lessonData.quiz,
        questionCount: lessonData.quiz?.questions?.length || 0,
        quiz: lessonData.quiz
      });
      
      setLesson(lessonData);

      // Fetch all lessons for navigation
      const lessonsRes = await fetch(`/api/courses/${courseId}/lessons`);
      const lessonsData = await lessonsRes.json();
      
      console.log('📋 All lessons fetched:', lessonsData.map((l: any) => ({
        title: l.title,
        hasQuiz: !!l.quiz,
        questionCount: l.quiz?.questions?.length || 0
      })));
      
      setAllLessons(Array.isArray(lessonsData) ? lessonsData : lessonsData.lessons || []);

      // Fetch progress if logged in
      if (session?.user) {
        const token = localStorage.getItem('token');
        const progressRes = await fetch(`/api/progress/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData);

          // Update last accessed lesson
          await fetch(`/api/progress/${courseId}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ lastAccessedLessonId: lessonId }),
          });

          // Check if quiz already passed
          if (progressData.enrollment.quizScores?.[lessonId]) {
            setQuizScore(progressData.enrollment.quizScores[lessonId]);
            setQuizSubmitted(true);
          }
        }
      }

    } catch (error) {
      console.error('Failed to fetch lesson data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}/questions`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const handleVideoEnd = () => {
    setVideoCompleted(true);
  };

  const handleQuizSubmit = async () => {
    if (!lesson?.quiz) return;

    let correct = 0;
    lesson.quiz.questions.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / lesson.quiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    // Save quiz score
    if (session?.user) {
      const token = localStorage.getItem('token');
      await fetch(`/api/progress/${courseId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quizScores: { [lessonId]: score },
        }),
      });
    }

    // If passed, mark as completed
    if (score >= (lesson.quiz.passingScore || 70)) {
      handleMarkComplete();
    }
  };

  const handleMarkComplete = async () => {
    if (!session?.user || !lessonId) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/progress/${courseId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          completedLessons: [lessonId],
        }),
      });

      // Refresh progress
      fetchLessonData();
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    }
  };

  const handlePostQuestion = async () => {
    if (!newQuestion.trim() || !session?.user) return;

    try {
      setSubmittingQuestion(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/lessons/${lessonId}/questions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: newQuestion }),
      });

      if (res.ok) {
        setNewQuestion('');
        fetchQuestions();
      }
    } catch (error) {
      console.error('Failed to post question:', error);
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const navigateToLesson = (targetLessonId: string) => {
    router.push(`/courses/${courseId}/lessons/${targetLessonId}`);
  };

  const handleAttemptNextLesson = (targetLesson: Lesson) => {
    // Check if current lesson has a quiz and if it's been passed
    if (lesson?.quiz && lesson.quiz.questions.length > 0) {
      const currentQuizScore = progress?.enrollment.quizScores?.[lessonId];
      const passingScore = lesson.quiz.passingScore || 75;
      
      if (!currentQuizScore || currentQuizScore < passingScore) {
        // Show quiz lock modal
        setAttemptingNextLesson(targetLesson);
        setShowQuizLockModal(true);
        return;
      }
    }
    
    // If no quiz or quiz already passed, navigate normally
    navigateToLesson(targetLesson._id);
  };

  const handleAttemptQuiz = () => {
    setShowQuizLockModal(false);
    setShowQuizModal(true);
    // Reset quiz state
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleQuizModalSubmit = async () => {
    if (!lesson?.quiz) return;

    let correct = 0;
    lesson.quiz.questions.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / lesson.quiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    // Save quiz score
    if (session?.user) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`/api/progress/${courseId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            lessonId,
            quizScore: score,
          }),
        });
        
        // Refresh progress
        await fetchLessonData();
      } catch (error) {
        console.error('Failed to save quiz score:', error);
      }
    }
  };

  const handleProceedToNextLesson = () => {
    setShowQuizModal(false);
    if (attemptingNextLesson) {
      navigateToLesson(attemptingNextLesson._id);
      setAttemptingNextLesson(null);
    }
  };

  const isLessonCompleted = (id: string) => {
    return progress?.enrollment.completedLessons.includes(id) || false;
  };

  const isLessonLocked = (targetLesson: Lesson) => {
    if (!progress || targetLesson.isPreview) return false;
    
    // Current lesson is always unlocked
    if (targetLesson._id === lessonId) return false;

    // Find previous lesson
    const currentIndex = allLessons.findIndex(l => l._id === targetLesson._id);
    if (currentIndex === 0) return false;

    const previousLesson = allLessons[currentIndex - 1];
    
    // Check if previous lesson is completed
    if (!isLessonCompleted(previousLesson._id)) {
      return true;
    }
    
    // Check if previous lesson has a quiz that needs to be passed
    if (previousLesson.quiz && previousLesson.quiz.questions.length > 0) {
      const quizScore = progress?.enrollment.quizScores?.[previousLesson._id];
      const passingScore = previousLesson.quiz.passingScore || 75;
      
      // If quiz exists but not passed, lesson is locked
      if (!quizScore || quizScore < passingScore) {
        return true;
      }
    }
    
    return false;
  };

  const needsToPassCurrentQuiz = () => {
    // Check if current lesson has a quiz that hasn't been passed
    console.log('🔍 needsToPassCurrentQuiz check:', {
      hasLesson: !!lesson,
      hasQuiz: !!lesson?.quiz,
      questionCount: lesson?.quiz?.questions?.length || 0,
      lessonId,
      quizScores: progress?.enrollment.quizScores
    });
    
    if (lesson?.quiz && lesson.quiz.questions.length > 0) {
      const currentQuizScore = progress?.enrollment.quizScores?.[lessonId];
      const passingScore = lesson.quiz.passingScore || 75;
      
      console.log('✅ Quiz exists! Score:', currentQuizScore, 'Passing:', passingScore);
      return !currentQuizScore || currentQuizScore < passingScore;
    }
    console.log('❌ No quiz or no questions');
    return false;
  };

  const getCurrentLessonIndex = () => {
    return allLessons.findIndex(l => l._id === lessonId);
  };

  const getNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    return null;
  };

  const getPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex > 0) {
      return allLessons[currentIndex - 1];
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Lesson not found</p>
          <Button 
            onClick={() => router.push('/')}
            className="mt-4 bg-amber-500 hover:bg-amber-600 text-gray-900"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const previousLesson = getPreviousLesson();
  const nextLesson = getNextLesson();
  const isCompleted = isLessonCompleted(lessonId);
  const passingScore = lesson.quiz?.passingScore || 70;
  const quizPassed = quizScore !== null && quizScore >= passingScore;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-3">
              {progress && (
                <div className="hidden md:flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-gray-300">
                    Progress: <span className="font-semibold text-white">{Math.round(progress.enrollment.progress)}%</span>
                  </span>
                </div>
              )}
              {isCompleted && (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Premium Video Player */}
            {lesson.videoUrl && (
              <Card className="overflow-hidden bg-linear-to-br from-gray-800 via-gray-800 to-gray-900 border-gray-700 shadow-2xl ring-1 ring-amber-500/10">
                {/* Video Header */}
                <div className="px-4 py-3 bg-gray-900/50 border-b border-gray-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-300">Now Playing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10 text-xs">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Premium Content
                    </Badge>
                  </div>
                </div>
                
                {/* Video Container */}
                <div className="relative bg-black group">
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/40 pointer-events-none z-10"></div>
                  
                  {/* Video Element */}
                  <div className="aspect-video relative">
                    <video
                      src={lesson.videoUrl}
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                      controls
                      className="w-full h-full object-cover"
                      onEnded={handleVideoEnd}
                      style={{
                        pointerEvents: 'auto'
                      }}
                    />
                    
                    {/* Completion Badge */}
                    {videoCompleted && (
                      <div className="absolute top-4 right-4 bg-green-500 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-green-500/50 z-20 animate-in slide-in-from-right">
                        <CheckCircle className="h-5 w-5 text-white" />
                        <span className="text-sm font-bold text-white">Completed!</span>
                      </div>
                    )}
                    
                    {/* Premium Watermark */}
                    <div className="absolute bottom-4 left-4 text-xs text-gray-500/50 font-mono z-20 pointer-events-none select-none">
                      © MIGO Learning Platform
                    </div>
                  </div>
                </div>
                
                {/* Video Footer */}
                <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="h-5 w-5 text-amber-500" />
                      <span className="text-sm text-gray-400">
                        {lesson.duration || 'Video Lesson'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Lock className="h-3 w-3" />
                      <span>Protected Content</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Lesson Header - Below Video */}
            <div className="bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Lesson {lesson.order}
                    </Badge>
                    {lesson.duration && (
                      <Badge variant="outline" className="border-gray-600 text-gray-400">
                        <Clock className="mr-1 h-3 w-3" />
                        {lesson.duration}
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
                  <p className="text-gray-300">{lesson.description}</p>
                </div>
              </div>
            </div>

            {/* Lesson Content Tabs */}
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="w-full justify-start bg-gray-800 border border-gray-700 p-1">
                <TabsTrigger value="content" className="data-[state=active]:bg-amber-500 data-[state=active]:text-gray-900">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Notes
                </TabsTrigger>
                {lesson.codeSnippets && lesson.codeSnippets.length > 0 && (
                  <TabsTrigger value="code" className="data-[state=active]:bg-amber-500 data-[state=active]:text-gray-900">
                    <Code className="mr-2 h-4 w-4" />
                    Code Examples
                  </TabsTrigger>
                )}
                {lesson.resources && lesson.resources.length > 0 && (
                  <TabsTrigger value="resources" className="data-[state=active]:bg-amber-500 data-[state=active]:text-gray-900">
                    <FileDown className="mr-2 h-4 w-4" />
                    Resources
                  </TabsTrigger>
                )}
                {lesson.quiz && (
                  <TabsTrigger value="quiz" className="data-[state=active]:bg-amber-500 data-[state=active]:text-gray-900">
                    <Award className="mr-2 h-4 w-4" />
                    Smart Quiz
                  </TabsTrigger>
                )}
                <TabsTrigger value="qa" className="data-[state=active]:bg-amber-500 data-[state=active]:text-gray-900">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Q&A ({questions.length})
                </TabsTrigger>
              </TabsList>

              {/* Notes Tab */}
              <TabsContent value="content" className="space-y-4 mt-4">
                <Card className="p-6 bg-gray-800 border-gray-700">
                  <div 
                    className="prose prose-sm max-w-none prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-li:text-gray-300 prose-a:text-amber-500 hover:prose-a:text-amber-400"
                    dangerouslySetInnerHTML={{ __html: lesson.content || '<p class="text-gray-400">No content available for this lesson.</p>' }}
                  />
                </Card>

                {!isCompleted && !lesson.quiz && (
                  <Button 
                    onClick={handleMarkComplete} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Mark as Complete
                  </Button>
                )}
              </TabsContent>

              {/* Code Tab */}
              {lesson.codeSnippets && lesson.codeSnippets.length > 0 && (
                <TabsContent value="code" className="space-y-4 mt-4">
                  {lesson.codeSnippets.map((snippet, index) => (
                    <Card key={index} className="p-6 bg-gray-800 border-gray-700">
                      {snippet.title && (
                        <h3 className="font-bold mb-3 text-white flex items-center gap-2">
                          <Code className="h-5 w-5 text-amber-500" />
                          {snippet.title}
                        </h3>
                      )}
                      <Badge variant="outline" className="mb-3 border-amber-500/30 text-amber-500 bg-amber-500/10">
                        {snippet.language}
                      </Badge>
                      <pre className="bg-gray-900 border border-gray-700 p-4 rounded-lg overflow-x-auto">
                        <code className="text-gray-300 text-sm">{snippet.code}</code>
                      </pre>
                    </Card>
                  ))}
                </TabsContent>
              )}

              {/* Resources Tab */}
              {lesson.resources && lesson.resources.length > 0 && (
                <TabsContent value="resources" className="space-y-4 mt-4">
                  <Card className="divide-y divide-gray-700 bg-gray-800 border-gray-700">
                    {lesson.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                            <Download className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{resource.title}</p>
                            <p className="text-sm text-gray-400">{resource.type}</p>
                          </div>
                        </div>
                        <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-amber-500 transition-colors" />
                      </a>
                    ))}
                  </Card>
                </TabsContent>
              )}

              {/* Quiz Tab */}
              {lesson.quiz && (
                <TabsContent value="quiz" className="space-y-6 mt-4">
                  <Card className="p-6 bg-gray-800 border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-amber-500/10 rounded-lg">
                        <Award className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xl">Knowledge Check</h3>
                        <p className="text-sm text-gray-400">
                          Pass with {passingScore}% or higher to unlock the next lesson
                        </p>
                      </div>
                    </div>

                    {quizSubmitted ? (
                      <div className="space-y-4">
                        <div className={`p-6 rounded-xl border-2 ${
                          quizPassed 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-red-500/10 border-red-500/30'
                        }`}>
                          <div className="flex items-center gap-3 mb-3">
                            {quizPassed ? (
                              <Trophy className="h-8 w-8 text-green-500" />
                            ) : (
                              <Award className="h-8 w-8 text-red-500" />
                            )}
                            <div>
                              <p className="font-bold text-xl text-white">
                                {quizPassed ? '🎉 Excellent Work!' : '📚 Keep Learning'}
                              </p>
                              <p className="text-gray-300">Your score: <span className="font-bold text-2xl">{quizScore}%</span></p>
                            </div>
                          </div>
                          {quizPassed && (
                            <p className="text-sm text-green-400 bg-green-500/10 p-3 rounded-lg mt-3">
                              ✅ Quiz passed! The next lesson has been unlocked.
                            </p>
                          )}
                          {!quizPassed && (
                            <p className="text-sm text-gray-400 mt-2">
                              Review the material and try again to unlock the next lesson.
                            </p>
                          )}
                        </div>

                        {!quizPassed && (
                          <Button
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                              setQuizScore(null);
                            }}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-6"
                          >
                            <Award className="mr-2 h-5 w-5" />
                            Retry Quiz
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {lesson.quiz.questions.map((q, qIndex) => (
                          <div key={qIndex} className="space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                            <p className="font-medium text-white flex items-start gap-2">
                              <span className="shrink-0 w-6 h-6 bg-amber-500 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                                {qIndex + 1}
                              </span>
                              <span className="flex-1">{q.question}</span>
                            </p>
                            <div className="space-y-2 ml-8">
                              {q.options.map((option, oIndex) => (
                                <label
                                  key={oIndex}
                                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                                    quizAnswers[qIndex] === oIndex
                                      ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20'
                                      : 'bg-gray-800 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${qIndex}`}
                                    checked={quizAnswers[qIndex] === oIndex}
                                    onChange={() => setQuizAnswers(prev => ({
                                      ...prev,
                                      [qIndex]: oIndex,
                                    }))}
                                    className="w-4 h-4 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-800"
                                  />
                                  <span className="text-gray-300">{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}

                        <Button
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(quizAnswers).length !== lesson.quiz.questions.length}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Award className="mr-2 h-5 w-5" />
                          Submit Quiz
                        </Button>
                      </div>
                    )}
                  </Card>
                </TabsContent>
              )}

              {/* Q&A Tab */}
              <TabsContent value="qa" className="space-y-4 mt-4">
                {/* Ask Question */}
                {session?.user && (
                  <Card className="p-6 bg-gray-800 border-gray-700">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-amber-500" />
                      Ask a Question
                    </h4>
                    <Textarea
                      placeholder="Ask a question about this lesson..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="mb-3 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500"
                      rows={4}
                    />
                    <Button 
                      onClick={handlePostQuestion}
                      disabled={!newQuestion.trim() || submittingQuestion}
                      className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {submittingQuestion ? 'Posting...' : 'Post Question'}
                    </Button>
                  </Card>
                )}

                {/* Questions List */}
                <div className="space-y-4">
                  {questions.length === 0 ? (
                    <Card className="p-8 text-center bg-gray-800 border-gray-700">
                      <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No questions yet. Be the first to ask!</p>
                    </Card>
                  ) : (
                    questions.map((q) => (
                      <Card key={q._id} className="p-5 bg-gray-800 border-gray-700">
                        <div className="flex items-start gap-3">
                          <Avatar className="border-2 border-amber-500/20">
                            <AvatarImage src={q.userId.avatar} />
                            <AvatarFallback className="bg-amber-500/10 text-amber-500">{q.userId.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-white">{q.userId.name}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(q.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="mb-3 text-gray-300">{q.question}</p>
                            
                            {/* Answers */}
                            {q.answers.length > 0 && (
                              <div className="ml-4 border-l-2 border-amber-500/30 pl-4 space-y-3 mt-3 bg-gray-900/30 rounded-r-lg p-3">
                                {q.answers.map((answer, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <Avatar className="h-6 w-6 border border-gray-700">
                                      <AvatarImage src={answer.userId.avatar} />
                                      <AvatarFallback className="text-xs bg-gray-700 text-gray-300">
                                        {answer.userId.name[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-200">{answer.userId.name}</p>
                                        {answer.isInstructor && (
                                          <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400 border-amber-500/30">Instructor</Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-300 mt-1">{answer.answer}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-3 mt-3">
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-amber-500 hover:bg-gray-700">
                                <ThumbsUp className="mr-1 h-3 w-3" />
                                <span className="text-gray-300">{q.upvotes.length}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 pt-6">
              <Button
                variant="outline"
                onClick={() => previousLesson && navigateToLesson(previousLesson._id)}
                disabled={!previousLesson}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-30 py-6 px-6"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Previous Lesson
              </Button>

              {nextLesson && (
                <Button
                  onClick={() => handleAttemptNextLesson(nextLesson)}
                  className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-6 px-6"
                >
                  Next Lesson
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <Card className="p-5 sticky top-24 bg-gray-800 border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-500" />
                  Course Lessons
                </h3>
                {progress && (
                  <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10">
                    {Math.round(progress.enrollment.progress)}%
                  </Badge>
                )}
              </div>
              
              {progress && (
                <div className="mb-4">
                  <Progress value={progress.enrollment.progress} className="h-2 bg-gray-700" />
                  <p className="text-xs text-gray-400 mt-1">
                    {progress.enrollment.completedLessons.length} of {allLessons.length} completed
                  </p>
                </div>
              )}
              
              <Separator className="my-4 bg-gray-700" />
              
              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
                {allLessons.map((l) => {
                  const locked = isLessonLocked(l);
                  const completed = isLessonCompleted(l._id);
                  const current = l._id === lessonId;

                  return (
                    <button
                      key={l._id}
                      onClick={() => {
                        console.log('🖱️ Lesson clicked:', {
                          targetLesson: l.title,
                          targetId: l._id,
                          currentId: lessonId,
                          isCurrent: current
                        });
                        
                        if (current) return;
                        
                        // Determine if target lesson is ahead of current
                        const currentIdx = allLessons.findIndex(lesson => lesson._id === lessonId);
                        const targetIdx = allLessons.findIndex(lesson => lesson._id === l._id);
                        const isMovingForward = targetIdx > currentIdx;
                        
                        console.log('📍 Navigation direction:', {
                          currentIdx,
                          targetIdx,
                          isMovingForward,
                          needsQuiz: needsToPassCurrentQuiz()
                        });
                        
                        // Only check current quiz if moving forward
                        if (isMovingForward && needsToPassCurrentQuiz()) {
                          console.log('🚫 BLOCKING: Need to pass current quiz');
                          setAttemptingNextLesson(l);
                          setShowQuizLockModal(true);
                          return;
                        }
                        
                        // If target lesson is locked (due to previous lesson requirements), show modal
                        if (locked && isMovingForward) {
                          console.log('🔒 Target lesson is locked');
                          handleAttemptNextLesson(l);
                        } else if (!locked) {
                          console.log('✅ Navigating to lesson');
                          // Safe to navigate (either going back or going to unlocked lesson)
                          navigateToLesson(l._id);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        current
                          ? 'bg-amber-500 text-gray-900 border-amber-500 shadow-lg shadow-amber-500/20'
                          : locked
                          ? 'bg-gray-900/50 border-gray-700 cursor-pointer hover:bg-gray-800/50'
                          : 'bg-gray-900/30 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs mb-1 ${current ? 'text-gray-700' : 'text-gray-500'}`}>
                            Lesson {l.order}
                          </p>
                          <p className={`text-sm font-medium line-clamp-2 ${current ? 'text-gray-900' : 'text-gray-300'}`}>
                            {l.title}
                          </p>
                        </div>
                        <div className="shrink-0">
                          {completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : locked ? (
                            <Lock className="h-4 w-4 text-gray-600" />
                          ) : current ? (
                            <PlayCircle className="h-4 w-4 text-gray-900" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Quiz Lock Modal */}
      <Dialog open={showQuizLockModal} onOpenChange={setShowQuizLockModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Lock className="h-6 w-6 text-amber-500" />
              Quiz Required
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-base mt-2">
              You need to complete the quiz in the current lesson before you can access the next lesson.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-amber-400 text-sm font-medium">
                📚 Complete the quiz with a score of 75% or higher to unlock the next lesson.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowQuizLockModal(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Go Back to Learning
            </Button>
            <Button
              onClick={handleAttemptQuiz}
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
            >
              <Award className="mr-2 h-4 w-4" />
              Attempt Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quiz Attempt Modal */}
      <Dialog open={showQuizModal} onOpenChange={setShowQuizModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Award className="h-6 w-6 text-amber-500" />
              {lesson?.title} - Quiz
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Pass with 75% or higher to unlock the next lesson
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {quizSubmitted ? (
              <div className="space-y-4">
                <div className={`p-6 rounded-xl border-2 ${
                  (quizScore ?? 0) >= 75
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {(quizScore ?? 0) >= 75 ? (
                      <Trophy className="h-10 w-10 text-green-500" />
                    ) : (
                      <Award className="h-10 w-10 text-red-500" />
                    )}
                    <div>
                      <p className="font-bold text-2xl text-white">
                        {(quizScore ?? 0) >= 75 ? '🎉 Congratulations!' : '📚 Keep Trying'}
                      </p>
                      <p className="text-gray-300">Your score: <span className="font-bold text-3xl">{quizScore}%</span></p>
                    </div>
                  </div>
                  {(quizScore ?? 0) >= 75 ? (
                    <p className="text-sm text-green-400 bg-green-500/10 p-3 rounded-lg mt-3">
                      ✅ Excellent work! You've passed the quiz and unlocked the next lesson.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">
                      You need at least 75% to pass. Review the lesson material and try again.
                    </p>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  {(quizScore ?? 0) < 75 ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setShowQuizModal(false)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Go Back to Lesson
                      </Button>
                      <Button
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                          setQuizScore(null);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
                      >
                        <Award className="mr-2 h-4 w-4" />
                        Retry Quiz
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleProceedToNextLesson}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6"
                    >
                      <ChevronRight className="mr-2 h-5 w-5" />
                      Continue to Next Lesson
                    </Button>
                  )}
                </DialogFooter>
              </div>
            ) : (
              <div className="space-y-6">
                {lesson?.quiz?.questions.map((q, qIndex) => (
                  <div key={qIndex} className="space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <p className="font-medium text-white flex items-start gap-2">
                      <span className="shrink-0 w-6 h-6 bg-amber-500 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                        {qIndex + 1}
                      </span>
                      <span className="flex-1">{q.question}</span>
                    </p>
                    <div className="space-y-2 ml-8">
                      {q.options.map((option, oIndex) => (
                        <label
                          key={oIndex}
                          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                            quizAnswers[qIndex] === oIndex
                              ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20'
                              : 'bg-gray-800 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            checked={quizAnswers[qIndex] === oIndex}
                            onChange={() => setQuizAnswers(prev => ({
                              ...prev,
                              [qIndex]: oIndex,
                            }))}
                            className="w-4 h-4 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-800"
                          />
                          <span className="text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <DialogFooter>
                  <Button
                    onClick={handleQuizModalSubmit}
                    disabled={Object.keys(quizAnswers).length !== (lesson?.quiz?.questions.length || 0)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Award className="mr-2 h-5 w-5" />
                    Submit Quiz
                  </Button>
                </DialogFooter>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
