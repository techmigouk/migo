# Amigo API Documentation

> **Version:** 1.0.0  
> **Base URL (Front):** `http://localhost:3000/api`  
> **Base URL (Admin):** `http://localhost:3001/api`  
> **Last Updated:** October 23, 2025

## Table of Contents

- [Authentication](#authentication)
- [User Endpoints (Front)](#user-endpoints-front)
- [Course Endpoints](#course-endpoints)
- [Enrollment Endpoints](#enrollment-endpoints)
- [Live Event Endpoints](#live-event-endpoints)
- [Payment & Subscription Endpoints](#payment--subscription-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

All authenticated endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Register User

**Endpoint:** `POST /api/auth/register`  
**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "createdAt": "2025-10-23T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- `name`: Required, min 2 characters
- `email`: Required, valid email format
- `password`: Required, min 6 characters

---

### Login

**Endpoint:** `POST /api/auth/login`  
**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### Get Current User

**Endpoint:** `GET /api/auth/me`  
**Access:** Protected (Requires Authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "profile": {
      "bio": "Student learning web development",
      "avatar": "https://example.com/avatar.jpg"
    },
    "subscription": {
      "plan": "premium",
      "status": "active"
    }
  }
}
```

---

### Request Password Reset

**Endpoint:** `POST /api/auth/forgot-password`  
**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### Reset Password

**Endpoint:** `POST /api/auth/reset-password`  
**Access:** Public

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "newSecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "token": "new_jwt_token"
  }
}
```

---

## User Endpoints (Front)

### Update Profile

**Endpoint:** `PATCH /api/users/profile`  
**Access:** Protected

**Request Body:**
```json
{
  "name": "John Updated",
  "profile": {
    "bio": "Updated bio",
    "avatar": "https://example.com/new-avatar.jpg",
    "location": "New York, USA"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john@example.com",
    "profile": {
      "bio": "Updated bio",
      "avatar": "https://example.com/new-avatar.jpg",
      "location": "New York, USA"
    }
  }
}
```

---

## Course Endpoints

### Get All Courses

**Endpoint:** `GET /api/courses`  
**Access:** Public

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `category` (string) - Filter by category
- `level` (string) - Filter by level (beginner, intermediate, advanced)
- `search` (string) - Search in title/description
- `sort` (string) - Sort field (createdAt, price, rating)
- `order` (string) - Sort order (asc, desc)

**Example Request:**
```
GET /api/courses?page=1&limit=10&category=programming&level=beginner&sort=rating&order=desc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "JavaScript Fundamentals",
        "description": "Learn JavaScript from scratch",
        "instructor": {
          "_id": "507f1f77bcf86cd799439013",
          "name": "Jane Smith"
        },
        "price": 49.99,
        "category": "programming",
        "level": "beginner",
        "duration": 1200,
        "rating": 4.8,
        "enrollmentCount": 1523,
        "thumbnail": "https://example.com/thumb.jpg",
        "status": "published"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

---

### Get Course by ID

**Endpoint:** `GET /api/courses/:id`  
**Access:** Public (basic info) / Protected (full details if enrolled)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "JavaScript Fundamentals",
    "description": "Complete JavaScript course",
    "instructor": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Jane Smith",
      "bio": "Expert developer",
      "avatar": "https://example.com/instructor.jpg"
    },
    "price": 49.99,
    "category": "programming",
    "level": "beginner",
    "duration": 1200,
    "rating": 4.8,
    "enrollmentCount": 1523,
    "curriculum": [
      {
        "section": "Introduction",
        "lessons": ["Lesson 1", "Lesson 2"]
      }
    ],
    "requirements": ["Basic computer skills"],
    "learningOutcomes": ["Master JavaScript basics"],
    "isEnrolled": false
  }
}
```

---

### Get Course Lessons

**Endpoint:** `GET /api/courses/:id/lessons`  
**Access:** Protected (must be enrolled)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "title": "Introduction to Variables",
      "description": "Learn about JavaScript variables",
      "courseId": "507f1f77bcf86cd799439012",
      "order": 1,
      "duration": 600,
      "type": "video",
      "content": {
        "videoUrl": "https://example.com/video1.mp4",
        "resources": [
          {
            "title": "Lesson Notes",
            "url": "https://example.com/notes.pdf"
          }
        ]
      },
      "isFree": true,
      "isCompleted": false
    }
  ]
}
```

---

## Enrollment Endpoints

### Enroll in Course

**Endpoint:** `POST /api/enrollments`  
**Access:** Protected

**Request Body:**
```json
{
  "courseId": "507f1f77bcf86cd799439012"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439011",
    "courseId": "507f1f77bcf86cd799439012",
    "enrolledAt": "2025-10-23T10:00:00.000Z",
    "progress": 0,
    "completedLessons": [],
    "status": "active"
  }
}
```

---

### Get User Enrollments

**Endpoint:** `GET /api/enrollments`  
**Access:** Protected

**Query Parameters:**
- `status` (string) - Filter by status (active, completed, expired)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "course": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "JavaScript Fundamentals",
        "thumbnail": "https://example.com/thumb.jpg"
      },
      "progress": 35,
      "completedLessons": ["507f1f77bcf86cd799439014"],
      "lastAccessedAt": "2025-10-23T09:00:00.000Z",
      "status": "active"
    }
  ]
}
```

---

### Update Lesson Progress

**Endpoint:** `PATCH /api/enrollments/:enrollmentId/progress`  
**Access:** Protected

**Request Body:**
```json
{
  "lessonId": "507f1f77bcf86cd799439014",
  "completed": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "progress": 50,
    "completedLessons": ["507f1f77bcf86cd799439014", "507f1f77bcf86cd799439016"],
    "lastAccessedAt": "2025-10-23T10:30:00.000Z"
  }
}
```

---

## Live Event Endpoints

### Get All Live Events

**Endpoint:** `GET /api/live-events`  
**Access:** Public

**Query Parameters:**
- `status` (string) - Filter by status (upcoming, live, completed)
- `startDate` (date) - Filter events after this date
- `category` (string) - Filter by category

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "title": "JavaScript Q&A Session",
      "description": "Live Q&A with expert",
      "instructor": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Jane Smith"
      },
      "startTime": "2025-10-25T15:00:00.000Z",
      "endTime": "2025-10-25T16:00:00.000Z",
      "duration": 60,
      "maxParticipants": 100,
      "registeredCount": 45,
      "status": "upcoming",
      "meetingLink": null,
      "category": "programming"
    }
  ]
}
```

---

### Register for Live Event

**Endpoint:** `POST /api/live-events/:id/register`  
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "data": {
    "eventId": "507f1f77bcf86cd799439017",
    "userId": "507f1f77bcf86cd799439011",
    "registeredAt": "2025-10-23T10:00:00.000Z",
    "status": "registered"
  },
  "message": "Successfully registered for event"
}
```

---

## Payment & Subscription Endpoints

### Create Checkout Session (Course Purchase)

**Endpoint:** `POST /api/stripe/create-checkout-session`  
**Access:** Protected

**Request Body:**
```json
{
  "courseId": "507f1f77bcf86cd799439012",
  "successUrl": "http://localhost:3000/courses/success",
  "cancelUrl": "http://localhost:3000/courses/cancel"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_a1b2c3d4",
    "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3d4"
  }
}
```

---

### Create Subscription Checkout

**Endpoint:** `POST /api/stripe/create-subscription-checkout`  
**Access:** Protected

**Request Body:**
```json
{
  "priceId": "price_1234567890",
  "plan": "premium",
  "successUrl": "http://localhost:3000/subscription/success",
  "cancelUrl": "http://localhost:3000/subscription/cancel"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_subscription123",
    "url": "https://checkout.stripe.com/pay/cs_test_subscription123"
  }
}
```

**Available Plans:**
- `basic` - $10/month (Basic Plan)
- `premium` - $50/month (Premium Plan)
- `enterprise` - $150/month (Enterprise Plan)

---

### Get User Payments

**Endpoint:** `GET /api/payments`  
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "userId": "507f1f77bcf86cd799439011",
      "amount": 49.99,
      "currency": "usd",
      "status": "succeeded",
      "type": "course",
      "courseId": "507f1f77bcf86cd799439012",
      "stripePaymentIntentId": "pi_1234567890",
      "createdAt": "2025-10-23T10:00:00.000Z"
    }
  ]
}
```

---

### Get Active Subscription

**Endpoint:** `GET /api/subscriptions/active`  
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439019",
    "userId": "507f1f77bcf86cd799439011",
    "plan": "premium",
    "status": "active",
    "stripeSubscriptionId": "sub_1234567890",
    "currentPeriodStart": "2025-10-01T00:00:00.000Z",
    "currentPeriodEnd": "2025-11-01T00:00:00.000Z",
    "cancelAtPeriodEnd": false
  }
}
```

---

### Cancel Subscription

**Endpoint:** `POST /api/subscriptions/:id/cancel`  
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "message": "Subscription will be canceled at period end",
  "data": {
    "_id": "507f1f77bcf86cd799439019",
    "status": "active",
    "cancelAtPeriodEnd": true,
    "currentPeriodEnd": "2025-11-01T00:00:00.000Z"
  }
}
```

---

## Admin Endpoints

> **Note:** All admin endpoints require authentication with `role: "admin"` or `role: "instructor"`

### Admin - Create Course

**Endpoint:** `POST /api/admin/courses`  
**Access:** Admin/Instructor

**Request Body:**
```json
{
  "title": "Advanced React Patterns",
  "description": "Master advanced React concepts",
  "instructorId": "507f1f77bcf86cd799439013",
  "price": 99.99,
  "category": "programming",
  "level": "advanced",
  "duration": 2400,
  "thumbnail": "https://example.com/thumb.jpg",
  "requirements": ["React basics", "JavaScript ES6+"],
  "learningOutcomes": ["Advanced patterns", "Performance optimization"],
  "curriculum": [
    {
      "section": "Introduction",
      "lessons": ["Overview", "Setup"]
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "Advanced React Patterns",
    "status": "draft",
    "createdAt": "2025-10-23T10:00:00.000Z"
  }
}
```

---

### Admin - Update Course

**Endpoint:** `PATCH /api/admin/courses/:id`  
**Access:** Admin/Instructor (own courses)

**Request Body:**
```json
{
  "title": "Updated Title",
  "price": 89.99,
  "status": "published"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "Updated Title",
    "price": 89.99,
    "status": "published",
    "updatedAt": "2025-10-23T11:00:00.000Z"
  }
}
```

---

### Admin - Delete Course

**Endpoint:** `DELETE /api/admin/courses/:id`  
**Access:** Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

### Admin - Create Live Event

**Endpoint:** `POST /api/admin/live-events`  
**Access:** Admin/Instructor

**Request Body:**
```json
{
  "title": "React Performance Workshop",
  "description": "Live coding session on React optimization",
  "instructorId": "507f1f77bcf86cd799439013",
  "startTime": "2025-10-30T15:00:00.000Z",
  "duration": 90,
  "maxParticipants": 50,
  "category": "programming",
  "meetingLink": "https://zoom.us/j/123456789"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439021",
    "title": "React Performance Workshop",
    "status": "upcoming",
    "createdAt": "2025-10-23T10:00:00.000Z"
  }
}
```

---

### Admin - Get All Users

**Endpoint:** `GET /api/admin/users`  
**Access:** Admin

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `role` (string)
- `search` (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student",
        "subscription": {
          "plan": "premium",
          "status": "active"
        },
        "enrollmentCount": 5,
        "createdAt": "2025-10-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 152,
      "pages": 16
    }
  }
}
```

---

### Admin - Analytics Dashboard

**Endpoint:** `GET /api/admin/analytics/dashboard`  
**Access:** Admin

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": 125450.00,
      "totalUsers": 1523,
      "activeSubscriptions": 456,
      "totalCourses": 45,
      "totalEnrollments": 3241
    },
    "revenueByMonth": [
      { "month": "2025-10", "revenue": 15230.50 }
    ],
    "popularCourses": [
      {
        "courseId": "507f1f77bcf86cd799439012",
        "title": "JavaScript Fundamentals",
        "enrollments": 523,
        "revenue": 26149.77
      }
    ],
    "subscriptionBreakdown": {
      "basic": 200,
      "premium": 150,
      "enterprise": 106
    }
  }
}
```

---

### Admin - Revenue Analytics

**Endpoint:** `GET /api/admin/analytics/revenue`  
**Access:** Admin

**Query Parameters:**
- `startDate` (date)
- `endDate` (date)
- `groupBy` (string) - day, week, month

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 45230.50,
    "courseRevenue": 25430.00,
    "subscriptionRevenue": 19800.50,
    "breakdown": [
      {
        "date": "2025-10-23",
        "revenue": 1523.50,
        "transactions": 12
      }
    ]
  }
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

**Error Response:**
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details if applicable"
  }
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

**Common Error Codes:**
- `VALIDATION_ERROR` - Invalid request data
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `ALREADY_EXISTS` - Duplicate resource
- `PAYMENT_FAILED` - Payment processing error
- `ENROLLMENT_LIMIT_REACHED` - Maximum enrollments reached

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Public endpoints:** 100 requests per 15 minutes per IP
- **Authenticated endpoints:** 300 requests per 15 minutes per user
- **Admin endpoints:** 500 requests per 15 minutes per admin

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1698062400
```

---

## Webhook Events (Stripe)

**Endpoint:** `POST /api/stripe/webhook`  
**Access:** Public (verified via Stripe signature)

**Supported Events:**
- `checkout.session.completed` - Payment successful
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Recurring payment successful
- `invoice.payment_failed` - Payment failed

**Webhook Payload Example:**
```json
{
  "id": "evt_1234567890",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_a1b2c3d4",
      "customer": "cus_1234567890",
      "amount_total": 4999,
      "metadata": {
        "userId": "507f1f77bcf86cd799439011",
        "courseId": "507f1f77bcf86cd799439012"
      }
    }
  }
}
```

---

## Testing

### Test Cards (Stripe)

**Success:**
- `4242 4242 4242 4242` - Visa (succeeds)
- `5555 5555 5555 4444` - Mastercard (succeeds)

**Decline:**
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds

**Use any future expiration date and any 3-digit CVC**

---

## Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "Amigo API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## Support

For API support or questions:
- **Email:** api-support@amigo.com
- **Documentation:** https://docs.amigo.com
- **Status Page:** https://status.amigo.com

---

**Last Updated:** October 23, 2025  
**API Version:** 1.0.0