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

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
    /youtube\.com\/v\/([^&\s]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// Helper function to check if URL is a YouTube link
const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

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

  // Handle play button overlay visibility
  useEffect(() => {
    const initializePlayButton = () => {
      const video = document.getElementById('lesson-video') as HTMLVideoElement;
      const playOverlay = document.getElementById('play-overlay') as HTMLElement;
      
      if (!video || !playOverlay) {
        setTimeout(initializePlayButton, 100);
        return;
      }

      const handlePlay = () => {
        playOverlay.style.opacity = '0';
        setTimeout(() => {
          playOverlay.style.display = 'none';
        }, 300);
      };

      const handlePause = () => {
        playOverlay.style.display = 'flex';
        setTimeout(() => {
          playOverlay.style.opacity = '1';
        }, 10);
      };

      const handleClick = () => {
        if (video.paused) {
          video.play();
        }
      };

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handlePause);
      playOverlay.addEventListener('click', handleClick);

      // Initial state - show overlay if video is paused
      playOverlay.style.display = 'flex';
      playOverlay.style.opacity = '1';

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handlePause);
        playOverlay.removeEventListener('click', handleClick);
      };
    };

    const cleanup = initializePlayButton();
    return cleanup;
  }, [lesson?.videoUrl]);

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
        
        // Refresh progress to update quiz scores
        await fetchLessonData();
      } catch (error) {
        console.error('Failed to save quiz score:', error);
      }
    }

    // If passed, mark as completed
    if (score >= (lesson.quiz.passingScore || 70)) {
      handleMarkComplete();
    }
  };

  const handleMarkComplete = async () => {
    console.log('Mark as Complete clicked!', { session: !!session?.user, lessonId });
    if (!session?.user || !lessonId) {
      console.log('Cannot mark complete - missing session or lessonId');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Sending mark complete request...');
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

      console.log('Lesson marked complete, refreshing progress...');
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
    // Use Next.js router for proper navigation
    router.push(`/courses/${courseId}/lessons/${targetLessonId}`);
  };

  const handleAttemptNextLesson = (targetLesson: Lesson) => {
    console.log('🎯 handleAttemptNextLesson called for:', targetLesson.title);
    
    // Check if current lesson has a quiz and if it's been passed
    if (lesson?.quiz && lesson.quiz.questions.length > 0) {
      const currentQuizScore = progress?.enrollment.quizScores?.[lessonId];
      const passingScore = lesson.quiz.passingScore || 75;
      
      console.log('📊 Quiz check:', {
        currentLessonId: lessonId,
        hasQuiz: true,
        currentQuizScore,
        passingScore,
        passed: currentQuizScore && currentQuizScore >= passingScore
      });
      
      if (!currentQuizScore || currentQuizScore < passingScore) {
        console.log('🚫 Quiz not passed - showing modal');
        // Show quiz lock modal
        setAttemptingNextLesson(targetLesson);
        setShowQuizLockModal(true);
        return;
      }
    }
    
    console.log('✅ No quiz or quiz passed - navigating');
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

  const isLessonUnlocked = (targetLesson: Lesson) => {
    if (!progress) return false;
    
    // Check if lesson is unlocked but not completed
    const currentIndex = allLessons.findIndex(l => l._id === targetLesson._id);
    if (currentIndex === 0) return true; // First lesson is always unlocked
    
    const previousLesson = allLessons[currentIndex - 1];
    
    // Check if previous lesson is completed
    if (!isLessonCompleted(previousLesson._id)) {
      return false;
    }
    
    // Check if previous lesson has a quiz that needs to be passed
    if (previousLesson.quiz && previousLesson.quiz.questions.length > 0) {
      const quizScore = progress?.enrollment.quizScores?.[previousLesson._id];
      const passingScore = previousLesson.quiz.passingScore || 75;
      
      // If quiz exists and passed, lesson is unlocked
      return quizScore && quizScore >= passingScore;
    }
    
    // No quiz on previous lesson, so this lesson is unlocked
    return true;
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
    <>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #f59e0b, #ea580c);
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #fbbf24, #f59e0b);
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }
        
        /* Smooth transitions for all interactive elements */
        * {
          transition-property: transform, opacity, box-shadow, background-color, border-color, color;
          transition-duration: 300ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Custom animations */
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
      
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

      <div className="container mx-auto px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
            {/* Premium Video Player */}
            {lesson.videoUrl && (
              <div className="relative p-1 rounded-3xl animate-in fade-in zoom-in-95 duration-700">
                {/* Animated Glowing Border Frame - Static */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-orange-600 to-amber-400 rounded-3xl opacity-30"></div>
                
                <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-amber-500/30 shadow-2xl rounded-3xl">
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-br-full"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-tr-full"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-500/20 to-transparent rounded-tl-full"></div>
                  
                  {/* Video Container */}
                  <div className="relative bg-black group">
                    {/* Video Element */}
                    <div className="aspect-video relative">
                      {isYouTubeUrl(lesson.videoUrl) ? (
                        // YouTube Video Player
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(lesson.videoUrl)}?rel=0&modestbranding=1&controls=1`}
                          className="w-full h-full object-cover rounded-2xl"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{
                            border: 'none',
                            pointerEvents: 'auto'
                          }}
                        />
                      ) : (
                        // Regular Video Player
                        <>
                          <video
                            id="lesson-video"
                            src={lesson.videoUrl}
                            controlsList="nodownload"
                            disablePictureInPicture
                            onContextMenu={(e) => e.preventDefault()}
                            controls
                            className="w-full h-full object-cover rounded-2xl"
                            onEnded={handleVideoEnd}
                            style={{
                              pointerEvents: 'auto'
                            }}
                          />
                          
                          {/* ALWAYS VISIBLE Glowing Play Button Overlay - Only for regular videos */}
                          <div 
                            id="play-overlay"
                            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-sm transition-opacity duration-500 rounded-2xl cursor-pointer"
                            style={{ display: 'none', opacity: '0' }}
                          >
                            {/* Outer glow rings */}
                            <div className="absolute">
                              <div className="w-72 h-72 rounded-full bg-amber-500/10 blur-3xl animate-pulse"></div>
                            </div>
                            <div className="absolute">
                              <div className="w-56 h-56 rounded-full bg-orange-500/20 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            </div>
                            
                            {/* Main play button */}
                            <div className="relative z-10">
                              {/* Animated ping effect */}
                              <div className="absolute inset-0 flex items-center justify-center animate-ping">
                                <div className="w-40 h-40 rounded-full bg-amber-500/40 blur-2xl"></div>
                              </div>
                              
                              {/* Rotating ring */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-44 h-44 rounded-full border-4 border-amber-500/30 border-t-amber-400/60 animate-spin" style={{ animationDuration: '3s' }}></div>
                              </div>
                              
                              {/* Pulse rings */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-36 h-36 rounded-full border-2 border-amber-400/40 animate-pulse"></div>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full border border-orange-400/30 animate-ping" style={{ animationDuration: '2s' }}></div>
                              </div>
                              
                              {/* Main button with gradient */}
                              <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 shadow-2xl shadow-amber-500/60 ring-8 ring-amber-500/20 hover:scale-110 hover:shadow-amber-500/80 transition-all duration-500 cursor-pointer group-hover:ring-amber-500/40">
                                {/* Inner glow */}
                                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                                {/* Triangle Play Icon */}
                                <div className="relative pl-2">
                                  <svg 
                                    width="48" 
                                    height="48" 
                                    viewBox="0 0 48 48" 
                                    fill="none" 
                                    className="drop-shadow-2xl"
                                    style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8)) drop-shadow(0 0 40px rgba(251, 191, 36, 0.6))' }}
                                  >
                                    <path 
                                      d="M12 8L38 24L12 40V8Z" 
                                      fill="white"
                                      className="animate-pulse"
                                    />
                                  </svg>
                                </div>
                              </div>
                              
                              {/* Bottom glow reflection */}
                              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-8 bg-gradient-to-b from-amber-500/40 to-transparent blur-xl rounded-full"></div>
                            </div>
                            
                            {/* Floating particles */}
                            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/60 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-orange-400/60 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
                            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-amber-300/60 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>
                            <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-orange-300/60 rounded-full animate-ping" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
                          </div>
                        </>
                      )}
                      
                      {/* Completion Badge */}
                      {videoCompleted && (
                        <div className="absolute top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-2 shadow-2xl shadow-green-500/50 z-20 animate-in slide-in-from-right border-2 border-green-400/30">
                          <CheckCircle className="h-6 w-6 text-white animate-bounce" />
                          <span className="text-base font-bold text-white">Completed!</span>
                        </div>
                      )}
                      
                      {/* Premium Watermark */}
                      <div className="absolute bottom-24 left-6 text-sm text-white/10 font-bold font-mono z-10 pointer-events-none select-none tracking-widest">
                        MIGO
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Lesson Header - Below Video */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/30 rounded-2xl p-8 group hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <div className="relative flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/15 hover:bg-amber-500/25 transition-all duration-300 shadow-lg shadow-amber-500/20 animate-in fade-in slide-in-from-left-2 duration-500">
                      <Sparkles className="mr-1.5 h-3.5 w-3.5 animate-pulse" />
                      Lesson {lesson.order}
                    </Badge>
                    {lesson.duration && (
                      <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-700/50 hover:bg-gray-700 transition-all duration-300 animate-in fade-in slide-in-from-left-2 duration-500 delay-75">
                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                        {lesson.duration}
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/40 shadow-lg shadow-green-500/20 animate-in fade-in zoom-in-50 duration-500 delay-150">
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5 animate-pulse" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-amber-50 to-white bg-clip-text text-transparent mb-3 leading-tight animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200 group-hover:scale-[1.02] transition-transform">{lesson.title}</h1>
                  <p className="text-gray-300 text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">{lesson.description}</p>
                </div>
              </div>
            </div>

            {/* Lesson Content Tabs */}
            <Tabs defaultValue="content" className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <TabsList className="w-full justify-start bg-gradient-to-r from-gray-800 via-gray-800/95 to-gray-800 border border-gray-700/50 p-1.5 rounded-xl shadow-xl backdrop-blur-sm">
                <TabsTrigger 
                  value="content" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/50 data-[state=active]:scale-105 transition-all duration-300 rounded-lg font-semibold"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Notes
                </TabsTrigger>
                {lesson.codeSnippets && lesson.codeSnippets.length > 0 && (
                  <TabsTrigger 
                    value="code" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/50 data-[state=active]:scale-105 transition-all duration-300 rounded-lg font-semibold"
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Code Examples
                  </TabsTrigger>
                )}
                {lesson.resources && lesson.resources.length > 0 && (
                  <TabsTrigger 
                    value="resources" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/50 data-[state=active]:scale-105 transition-all duration-300 rounded-lg font-semibold"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Resources
                  </TabsTrigger>
                )}
                {lesson.quiz && (
                  <TabsTrigger 
                    value="quiz" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/50 data-[state=active]:scale-105 transition-all duration-300 rounded-lg font-semibold"
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Smart Quiz
                  </TabsTrigger>
                )}
                <TabsTrigger 
                  value="qa" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/50 data-[state=active]:scale-105 transition-all duration-300 rounded-lg font-semibold"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Q&A ({questions.length})
                </TabsTrigger>
              </TabsList>

              {/* Notes Tab */}
              <TabsContent value="content" className="space-y-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-8 bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-800 border border-gray-700/50 shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 rounded-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>
                  <div 
                    className="prose prose-sm max-w-none prose-invert prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300 prose-p:leading-relaxed prose-strong:text-white prose-strong:font-semibold prose-li:text-gray-300 prose-a:text-amber-400 hover:prose-a:text-amber-300 prose-a:transition-colors prose-a:duration-300 relative"
                    dangerouslySetInnerHTML={{ __html: lesson.content || '<p class="text-gray-400">No content available for this lesson.</p>' }}
                  />
                </Card>

                {!isCompleted && !lesson.quiz && (
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Button clicked!');
                      handleMarkComplete();
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-7 text-lg shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] transition-all duration-300 rounded-xl group"
                  >
                    <CheckCircle className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    Mark as Complete
                  </Button>
                )}
              </TabsContent>

              {/* Code Tab */}
              {lesson.codeSnippets && lesson.codeSnippets.length > 0 && (
                <TabsContent value="code" className="space-y-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {lesson.codeSnippets.map((snippet, index) => (
                    <Card key={index} className="p-6 bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-800 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 rounded-2xl group animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>
                      {snippet.title && (
                        <h3 className="font-bold mb-4 text-white flex items-center gap-2 text-lg relative group-hover:text-amber-400 transition-colors duration-300">
                          <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors duration-300">
                            <Code className="h-5 w-5 text-amber-400" />
                          </div>
                          {snippet.title}
                        </h3>
                      )}
                      <Badge variant="outline" className="mb-4 border-amber-500/40 text-amber-400 bg-amber-500/15 hover:bg-amber-500/25 transition-all duration-300 shadow-lg shadow-amber-500/20 relative">
                        {snippet.language}
                      </Badge>
                      <pre className="bg-gradient-to-br from-gray-900 via-gray-900/95 to-black border border-gray-700/50 p-5 rounded-xl overflow-x-auto shadow-inner relative group-hover:border-amber-500/20 transition-all duration-500">
                        <code className="text-gray-300 text-sm font-mono">{snippet.code}</code>
                      </pre>
                    </Card>
                  ))}
                </TabsContent>
              )}

              {/* Resources Tab */}
              {lesson.resources && lesson.resources.length > 0 && (
                <TabsContent value="resources" className="space-y-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Card className="divide-y divide-gray-700/50 bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-800 border border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden">
                    {lesson.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-gray-700/30 hover:via-amber-500/5 hover:to-gray-700/30 transition-all duration-500 group relative overflow-hidden animate-in fade-in slide-in-from-left-2 duration-500"
                        style={{ animationDelay: `${index * 75}ms` }}
                      >
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="flex items-center gap-4 relative">
                          <div className="p-3 bg-gradient-to-br from-amber-500/15 to-orange-500/15 rounded-xl group-hover:from-amber-500/25 group-hover:to-orange-500/25 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-amber-500/20">
                            <Download className="h-5 w-5 text-amber-400 group-hover:animate-bounce" />
                          </div>
                          <div>
                            <p className="font-semibold text-white group-hover:text-amber-400 transition-colors duration-300">{resource.title}</p>
                            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{resource.type}</p>
                          </div>
                        </div>
                        <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 relative" />
                      </a>
                    ))}
                  </Card>
                </TabsContent>
              )}

              {/* Quiz Tab */}
              {lesson.quiz && (
                <TabsContent value="quiz" className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Card className="p-8 bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-800 border border-gray-700/50 shadow-2xl rounded-2xl relative overflow-hidden group">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="flex items-center gap-4 mb-8 relative">
                      <div className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl shadow-lg shadow-amber-500/20 animate-pulse">
                        <Award className="h-7 w-7 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-2xl bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">Knowledge Check</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Pass with <span className="text-amber-400 font-bold">{passingScore}%</span> or higher to unlock the next lesson
                        </p>
                      </div>
                    </div>

                    {quizSubmitted ? (
                      <div className="space-y-5 relative animate-in zoom-in-95 fade-in duration-500">
                        <div className={`p-8 rounded-2xl border-2 relative overflow-hidden ${
                          quizPassed 
                            ? 'bg-gradient-to-br from-green-500/15 to-emerald-500/10 border-green-500/40 shadow-2xl shadow-green-500/20' 
                            : 'bg-gradient-to-br from-red-500/15 to-orange-500/10 border-red-500/40 shadow-2xl shadow-red-500/20'
                        }`}>
                          {/* Success confetti effect */}
                          {quizPassed && (
                            <>
                              <div className="absolute top-0 left-0 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
                              <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                              <div className="absolute bottom-0 left-0 w-2 h-2 bg-green-300 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                              <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-300 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
                            </>
                          )}
                          
                          <div className="flex items-center gap-4 mb-4 relative">
                            {quizPassed ? (
                              <div className="relative">
                                <Trophy className="h-10 w-10 text-green-400 animate-bounce" />
                                <div className="absolute inset-0 bg-green-400/30 rounded-full blur-xl animate-pulse"></div>
                              </div>
                            ) : (
                              <Award className="h-10 w-10 text-red-400" />
                            )}
                            <div>
                              <p className="font-bold text-2xl text-white mb-1">
                                {quizPassed ? '🎉 Excellent Work!' : '📚 Keep Learning'}
                              </p>
                              <p className="text-gray-300">Your score: <span className={`font-bold text-3xl ${quizPassed ? 'text-green-400' : 'text-red-400'}`}>{quizScore}%</span></p>
                            </div>
                          </div>
                          {quizPassed && (
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 p-4 rounded-xl mt-4 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-500 delay-200">
                              <p className="text-sm text-green-300 font-medium flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Quiz passed! The next lesson has been unlocked.
                              </p>
                            </div>
                          )}
                          {!quizPassed && (
                            <p className="text-sm text-gray-400 mt-3">
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
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-gray-900 font-bold py-7 text-lg shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 hover:scale-[1.02] transition-all duration-300 rounded-xl group"
                          >
                            <Award className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                            Retry Quiz
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6 relative">
                        {lesson.quiz.questions.map((q, qIndex) => (
                          <div key={qIndex} className="space-y-4 p-6 bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-2xl border border-gray-700/50 shadow-lg hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 group animate-in fade-in slide-in-from-left-2 duration-500" style={{ animationDelay: `${qIndex * 100}ms` }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            
                            <p className="font-semibold text-white flex items-start gap-3 text-base relative">
                              <span className="shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 text-gray-900 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg shadow-amber-500/30">
                                {qIndex + 1}
                              </span>
                              <span className="flex-1 pt-0.5">{q.question}</span>
                            </p>
                            <div className="space-y-3 ml-11 relative">
                              {q.options.map((option, oIndex) => (
                                <label
                                  key={oIndex}
                                  className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-500 group/option ${
                                    quizAnswers[qIndex] === oIndex
                                      ? 'bg-gradient-to-r from-amber-500/25 to-orange-500/25 border-amber-500/60 shadow-2xl shadow-amber-500/30 scale-[1.02]'
                                      : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:from-gray-700/60 hover:to-gray-800/60 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10'
                                  }`}
                                >
                                  <div className={`relative flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                                    quizAnswers[qIndex] === oIndex
                                      ? 'border-amber-400 bg-amber-400 shadow-lg shadow-amber-400/50'
                                      : 'border-gray-500 group-hover/option:border-amber-400'
                                  }`}>
                                    {quizAnswers[qIndex] === oIndex && (
                                      <div className="w-2.5 h-2.5 rounded-full bg-gray-900 animate-in zoom-in-50 duration-200"></div>
                                    )}
                                  </div>
                                  <input
                                    type="radio"
                                    name={`question-${qIndex}`}
                                    checked={quizAnswers[qIndex] === oIndex}
                                    onChange={() => setQuizAnswers(prev => ({
                                      ...prev,
                                      [qIndex]: oIndex,
                                    }))}
                                    className="sr-only"
                                  />
                                  <span className={`flex-1 transition-colors duration-300 ${
                                    quizAnswers[qIndex] === oIndex
                                      ? 'text-white font-semibold'
                                      : 'text-gray-300 group-hover/option:text-white'
                                  }`}>{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}

                        <Button
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(quizAnswers).length !== lesson.quiz.questions.length}
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-gray-900 font-bold py-7 text-lg shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-amber-500/50 disabled:hover:scale-100 hover:scale-[1.02] transition-all duration-300 rounded-xl group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          <Award className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform duration-300 relative" />
                          <span className="relative">Submit Quiz</span>
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
            <div className="flex justify-between gap-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <Button
                variant="outline"
                onClick={() => previousLesson && navigateToLesson(previousLesson._id)}
                disabled={!previousLesson}
                className="border-2 border-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white hover:border-amber-500/30 disabled:opacity-30 py-7 px-8 rounded-xl font-semibold text-base shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 group disabled:hover:shadow-none"
              >
                <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                Previous Lesson
              </Button>

              {nextLesson && (
                <Button
                  onClick={() => handleAttemptNextLesson(nextLesson)}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-gray-900 font-bold py-7 px-8 rounded-xl text-base shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 hover:scale-105 transition-all duration-300 group"
                >
                  Next Lesson
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <Card className="p-6 sticky top-24 bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-800 border border-gray-700/50 shadow-2xl rounded-2xl backdrop-blur-sm overflow-hidden">
              {/* Animated glow - contained within card */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl blur opacity-30 animate-pulse pointer-events-none"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                    <div className="p-2 bg-amber-500/15 rounded-lg">
                      <BookOpen className="h-5 w-5 text-amber-400" />
                    </div>
                    Course Lessons
                  </h3>
                  {progress && (
                    <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/20 font-bold">
                      {Math.round(progress.enrollment.progress)}%
                    </Badge>
                  )}
                </div>
                
                {progress && (
                  <div className="mb-5 animate-in fade-in zoom-in-95 duration-500 delay-300">
                    <div className="relative">
                      <Progress value={progress.enrollment.progress} className="h-3 bg-gray-900 rounded-full overflow-hidden shadow-inner" />
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 rounded-full transition-all duration-1000 shadow-lg shadow-amber-500/50"
                        style={{ 
                          width: `${progress.enrollment.progress}%`,
                          background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #ea580c)'
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-medium">
                      {progress.enrollment.completedLessons.length} of {allLessons.length} completed
                    </p>
                  </div>
                )}
                
                <Separator className="my-5 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                
                <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
                {allLessons.map((l, index) => {
                  const locked = isLessonLocked(l);
                  const completed = isLessonCompleted(l._id);
                  const current = l._id === lessonId;
                  const unlocked = !locked && !completed && !current;

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
                      className={`relative w-full text-left p-4 rounded-xl border-2 transition-all duration-500 group overflow-hidden animate-in fade-in slide-in-from-right-2 ${
                        current
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-gray-900 border-amber-400 shadow-2xl shadow-amber-500/40 scale-105'
                          : locked
                          ? 'bg-gray-900/50 border-gray-700/50 cursor-pointer hover:bg-gray-800/70 hover:border-gray-600 hover:shadow-lg'
                          : 'bg-gradient-to-br from-gray-900/40 to-gray-800/40 border-gray-700/50 hover:from-gray-800/60 hover:to-gray-700/60 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10 hover:scale-[1.02]'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Hover glow effect */}
                      {!current && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      )}
                      
                      {/* Current lesson pulse effect */}
                      {current && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse"></div>
                      )}
                      
                      <div className="flex items-start justify-between gap-3 relative">
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs mb-1.5 font-semibold ${current ? 'text-gray-800' : 'text-gray-500 group-hover:text-amber-400 transition-colors duration-300'}`}>
                            Lesson {l.order}
                          </p>
                          <p className={`text-sm font-semibold line-clamp-2 ${current ? 'text-gray-900' : 'text-gray-300 group-hover:text-white transition-colors duration-300'}`}>
                            {l.title}
                          </p>
                        </div>
                        <div className="shrink-0">
                          {completed ? (
                            <div className="relative">
                              <CheckCircle className="h-5 w-5 text-green-400 animate-in zoom-in-50 duration-500" />
                              <div className="absolute inset-0 bg-green-400/30 rounded-full blur animate-pulse"></div>
                            </div>
                          ) : current ? (
                            <div className="relative">
                              <PlayCircle className="h-5 w-5 text-gray-900 animate-pulse" />
                            </div>
                          ) : unlocked ? (
                            <div className="relative">
                              <PlayCircle className="h-5 w-5 text-red-500 group-hover:text-red-400 transition-colors duration-300" />
                              <div className="absolute inset-0 bg-red-500/20 rounded-full blur group-hover:bg-red-400/30 transition-all duration-300"></div>
                            </div>
                          ) : locked ? (
                            <Lock className="h-4 w-4 text-gray-600 group-hover:text-gray-500 transition-colors duration-300" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-600 group-hover:border-amber-400 group-hover:shadow-lg group-hover:shadow-amber-400/30 transition-all duration-300" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
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
    </>
  );
}
