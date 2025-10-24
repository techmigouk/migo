/**
 * Analytics tracking utility for client-side events
 * Automatically batches and sends events to the analytics API
 */

interface AnalyticsEvent {
  eventType: string;
  eventData?: Record<string, any>;
  userId?: string;
  sessionId: string;
}

class AnalyticsTracker {
  private queue: AnalyticsEvent[] = [];
  private sessionId: string;
  private batchSize = 10;
  private flushInterval = 5000; // 5 seconds
  private timer: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.startFlushTimer();
    
    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush());
    }
  }

  /**
   * Track an analytics event
   */
  track(eventType: string, eventData?: Record<string, any>, userId?: string) {
    const event: AnalyticsEvent = {
      eventType,
      eventData,
      userId,
      sessionId: this.sessionId,
    };

    this.queue.push(event);

    // Flush if batch size reached
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string) {
    this.track('page_view', {
      path,
      title: title || document.title,
      referrer: document.referrer,
    });
  }

  /**
   * Track course view
   */
  trackCourseView(courseId: string, courseTitle: string) {
    this.track('course_view', {
      courseId,
      courseTitle,
    });
  }

  /**
   * Track lesson start
   */
  trackLessonStart(courseId: string, lessonId: string, lessonTitle: string) {
    this.track('lesson_start', {
      courseId,
      lessonId,
      lessonTitle,
    });
  }

  /**
   * Track lesson complete
   */
  trackLessonComplete(courseId: string, lessonId: string, duration?: number) {
    this.track('lesson_complete', {
      courseId,
      lessonId,
      duration,
    });
  }

  /**
   * Track video events
   */
  trackVideoPlay(videoId: string, courseId?: string, lessonId?: string) {
    this.track('video_play', {
      videoId,
      courseId,
      lessonId,
    });
  }

  trackVideoPause(videoId: string, currentTime: number) {
    this.track('video_pause', {
      videoId,
      currentTime,
    });
  }

  trackVideoComplete(videoId: string, duration: number) {
    this.track('video_complete', {
      videoId,
      duration,
    });
  }

  /**
   * Track search
   */
  trackSearch(query: string, resultsCount?: number) {
    this.track('search', {
      query,
      resultsCount,
    });
  }

  /**
   * Track enrollment
   */
  trackEnrollment(courseId: string, courseTitle: string) {
    this.track('enrollment', {
      courseId,
      courseTitle,
    });
  }

  /**
   * Track purchase
   */
  trackPurchase(courseId: string, amount: number, currency: string) {
    this.track('purchase', {
      courseId,
      amount,
      currency,
    });
  }

  /**
   * Track authentication events
   */
  trackLogin(userId: string) {
    this.track('login', {}, userId);
  }

  trackLogout(userId: string) {
    this.track('logout', {}, userId);
  }

  trackSignup(userId: string) {
    this.track('signup', {}, userId);
  }

  /**
   * Flush events to API
   */
  async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
      // Re-add events to queue on failure
      this.queue.unshift(...events);
    }
  }

  /**
   * Get or create session ID
   */
  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') {
      return this.generateSessionId();
    }

    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Start automatic flush timer
   */
  private startFlushTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Stop tracking and flush remaining events
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.flush();
  }
}

// Export singleton instance
export const analytics = new AnalyticsTracker();

// Export class for custom instances if needed
export { AnalyticsTracker };