'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  PlayCircle, 
  CheckCircle, 
  Lock, 
  Star, 
  Clock, 
  Users,
  Award,
  BookOpen,
  FileText,
  Loader2
} from 'lucide-react';

interface Lesson {
  _id: string;
  title: string;
  order: number;
  duration?: number;
  isPreview?: boolean;
}

interface Review {
  _id: string;
  userId: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface CourseDetails {
  _id: string;
  title: string;
  description: string;
  introVideo?: string;
  thumbnail?: string;
  instructor?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  level?: string;
  duration?: string;
  whatYouWillLearn?: string[];
  prerequisites?: string[];
  targetAudience?: string[];
  totalLessons?: number;
}

interface EnrollmentData {
  enrolled: boolean;
  progress?: number;
  lastAccessedLessonId?: string;
  status?: string;
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<EnrollmentData>({ enrolled: false });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const courseId = params?.courseId as string;

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Fetch course details
      const courseRes = await fetch(`/api/courses/${courseId}`);
      if (!courseRes.ok) throw new Error('Failed to fetch course');
      const courseData = await courseRes.json();
      setCourse(courseData);

      // Fetch lessons
      const lessonsRes = await fetch(`/api/courses/${courseId}/lessons`);
      if (!lessonsRes.ok) throw new Error('Failed to fetch lessons');
      const lessonsData = await lessonsRes.json();
      setLessons(Array.isArray(lessonsData) ? lessonsData : lessonsData.lessons || []);

      // Fetch enrollment status if logged in
      const token = localStorage.getItem('token');
      if (token) {
        const enrollRes = await fetch(`/api/courses/${courseId}/enroll`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (enrollRes.ok) {
          const enrollData = await enrollRes.json();
          setEnrollment(enrollData);
        }
      }

      // Fetch reviews
      try {
        const reviewsRes = await fetch(`/api/courses/${courseId}/reviews`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData.reviews || []);
          setAverageRating(reviewsData.averageRating || 0);
          setTotalReviews(reviewsData.totalReviews || 0);
        }
      } catch (error) {
        console.log('Reviews not available');
      }

    } catch (error) {
      console.error('Failed to fetch course data:', error);
      alert('An error occurred: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent(`/courses/${courseId}`));
      return;
    }

    try {
      setEnrolling(true);
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      
      // If successful OR already enrolled, redirect to first lesson
      if (res.ok || data.message === 'Already enrolled in this course') {
        setEnrollment({ enrolled: true, progress: data.enrollment?.progress || 0, status: 'active' });
        
        // Redirect to first lesson immediately
        if (lessons.length > 0) {
          router.push(`/courses/${courseId}/lessons/${lessons[0]._id}`);
        }
      } else {
        alert(data.error || data.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleContinueLearning = () => {
    if (enrollment.lastAccessedLessonId) {
      router.push(`/courses/${courseId}/lessons/${enrollment.lastAccessedLessonId}`);
    } else if (lessons.length > 0) {
      router.push(`/courses/${courseId}/lessons/${lessons[0]._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-muted-foreground">{course.description}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                {course.level && (
                  <Badge variant="secondary" className="px-3 py-1">
                    <Award className="h-4 w-4 mr-1" />
                    {course.level}
                  </Badge>
                )}
                {course.duration && (
                  <Badge variant="secondary" className="px-3 py-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </Badge>
                )}
                <Badge variant="secondary" className="px-3 py-1">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {lessons.length} Lessons
                </Badge>
                {totalReviews > 0 && (
                  <Badge variant="secondary" className="px-3 py-1">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {averageRating.toFixed(1)} ({totalReviews} reviews)
                  </Badge>
                )}
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={course.instructor.avatar} />
                    <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                    <p className="font-medium">{course.instructor.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Enrollment Card */}
            <div>
              <Card className="p-6 space-y-4 sticky top-4">
                {/* Intro Video or Thumbnail */}
                {course.introVideo && (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <video 
                      src={course.introVideo} 
                      controls 
                      className="w-full h-full object-cover"
                      poster={course.thumbnail}
                    />
                  </div>
                )}

                {enrollment.enrolled ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Your Progress</span>
                        <span className="font-medium">{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>

                    <Button 
                      onClick={handleContinueLearning}
                      className="w-full"
                      size="lg"
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Continue Learning
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Status: {enrollment.status}
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full"
                    size="lg"
                  >
                    {enrolling ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enrolling...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Start Learning Now
                      </>
                    )}
                  </Button>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <Card className="p-6">
                  <ul className="grid md:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </section>
            )}

            {/* Course Curriculum */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
              <Card className="divide-y">
                {lessons.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No lessons available yet
                  </div>
                ) : (
                  lessons.map((lesson) => {
                    const isLocked = !enrollment.enrolled && !lesson.isPreview;
                    
                    return (
                      <div 
                        key={lesson._id}
                        className={`p-4 flex items-center justify-between ${
                          isLocked ? 'opacity-60' : 'hover:bg-muted/50 cursor-pointer'
                        }`}
                        onClick={() => {
                          if (!isLocked) {
                            router.push(`/courses/${courseId}/lessons/${lesson._id}`);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                            {lesson.order}
                          </div>
                          <div>
                            <p className="font-medium">{lesson.title}</p>
                            {lesson.duration && (
                              <p className="text-sm text-muted-foreground">{lesson.duration} min</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {lesson.isPreview && (
                            <Badge variant="outline">Preview</Badge>
                          )}
                          {isLocked ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <PlayCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </Card>
            </section>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
                <Card className="p-6">
                  <ul className="space-y-2">
                    {course.prerequisites.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </section>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((review) => (
                    <Card key={review._id} className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.userId.avatar} />
                          <AvatarFallback>{review.userId.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{review.userId.name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Target Audience */}
            {course.targetAudience && course.targetAudience.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Who This Course Is For
                </h3>
                <ul className="space-y-2">
                  {course.targetAudience.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Instructor Bio */}
            {course.instructor?.bio && (
              <Card className="p-6">
                <h3 className="font-bold mb-3">About the Instructor</h3>
                <p className="text-sm text-muted-foreground">{course.instructor.bio}</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
