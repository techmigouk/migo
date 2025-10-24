# Migo - AI-Powered Learning Management Platform

> A comprehensive full-stack learning management system with AI assistant integration, built with Next.js, React, TypeScript, and MongoDB.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)

## 🎯 Overview

Migo is a modern learning management system designed for educational institutions and online learning platforms. It provides three distinct dashboards:

- **Student Dashboard** (Front) - Course enrollment, learning progress, community interaction
- **Admin Dashboard** - User management, course management, analytics, system configuration
- **User Dashboard** - Personalized learning experience with AI assistant

## ✨ Features

### 🎓 Student Features
- **Course Management** - Browse, enroll, and track course progress
- **Interactive Learning** - Video lessons, quizzes, assignments
- **Community** - Discussion forums, peer interaction
- **AI Assistant** - Personalized learning recommendations
- **Progress Tracking** - Visual analytics and achievements
- **Mobile Responsive** - Full mobile experience

### 👨‍💼 Admin Features
- **User Management** - CRUD operations, role-based access control
- **Course Management** - Create, edit, publish courses and lessons
- **Analytics Dashboard** - Real-time metrics, charts, reporting
- **Financial Management** - Revenue tracking, subscription management
- **Marketing Tools** - Email campaigns, promotions
- **Content Management** - Blog posts, announcements
- **Security** - Audit logs, 2FA support
- **AI Configuration** - Manage AI models and settings

### 👤 User Features
- **Personalized Dashboard** - Customized learning path
- **Profile Management** - Complete profile settings
- **Subscription Management** - Upgrade/downgrade plans
- **Notifications** - Real-time updates
- **Learning Analytics** - Personal statistics and insights

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, shadcn/ui
- **State Management:** React Context API
- **Forms:** React Hook Form
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcrypt
- **File Upload:** Multer
- **Email:** Nodemailer
- **AI Integration:** OpenAI API

### DevOps & Tools
- **Monorepo:** Turborepo
- **Package Manager:** pnpm
- **Testing:** Playwright (E2E)
- **Linting:** ESLint
- **Version Control:** Git

## 📁 Project Structure

```
migo/
├── admin/              # Admin dashboard (Next.js)
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities and database
│   ├── models/        # MongoDB models
│   └── services/      # Business logic
├── front/             # Student frontend (Next.js)
│   ├── app/           # App router pages
│   ├── components/    # React components
│   └── lib/           # Utilities
├── user/              # User dashboard (Next.js)
│   ├── app/           # App router pages
│   └── components/    # React components
├── shared/            # Shared utilities and types
│   └── lib/           # Common utilities
├── tests/             # E2E tests (Playwright)
│   └── specs/         # Test specifications
├── package.json       # Root package config
├── pnpm-workspace.yaml # Workspace configuration
└── turbo.json         # Turborepo configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- MongoDB 6+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/migo.git
   cd migo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env.local` files in each workspace:

   **admin/.env.local**
   ```env
   MONGODB_URI=mongodb://localhost:27017/migo
   JWT_SECRET=your-jwt-secret-key-here
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

   **front/.env.local**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/migo
   ```

   **user/.env.local**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3004
   MONGODB_URI=mongodb://localhost:27017/migo
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:6
   ```

5. **Run development servers**
   ```bash
   pnpm dev
   ```

   This starts:
   - Student Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:3001
   - User Dashboard: http://localhost:3004

## 💻 Development

### Available Scripts

```bash
# Start all dev servers
pnpm dev

# Build all apps
pnpm build

# Start production servers
pnpm start

# Run linting
pnpm lint

# Run tests
cd tests && npx playwright test

# Run specific workspace
pnpm --filter admin dev
pnpm --filter front dev
pnpm --filter user dev
```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** in the appropriate workspace

3. **Test your changes**
   ```bash
   cd tests
   npx playwright test
   ```

4. **Commit with conventional commits**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🧪 Testing

The project uses Playwright for end-to-end testing across multiple browsers.

### Run Tests

```bash
# Navigate to tests directory
cd tests

# Run all tests
npx playwright test

# Run specific test file
npx playwright test registration.spec.js

# Run tests in headed mode
npx playwright test --headed

# Run tests in specific browser
npx playwright test --project=chromium

# Generate HTML report
npx playwright test --reporter=html
npx playwright show-report
```

### Test Coverage

- **Registration & Authentication** - User signup, login, session management
- **User Dashboard** - Navigation, profile, courses, analytics
- **Admin Dashboard** - User management, course management, analytics
- **Responsive Design** - Mobile and tablet viewports

**Current Test Stats:**
- Total Tests: 166+
- Pass Rate: 100%
- Browsers: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, Edge

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - REST API endpoints and usage
- [Email Documentation](./EMAIL_DOCUMENTATION.md) - Email templates and configuration
- [File Storage](./FILE_STORAGE_DOCUMENTATION.md) - File upload and storage guide
- [Mock Data Removal](./MOCK_DATA_REMOVAL_CHECKLIST.md) - Production readiness checklist

## 🚀 Deployment

### Build for Production

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter admin build
```

### Environment Variables for Production

Ensure all production environment variables are set:

- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong secret key for JWT
- `OPENAI_API_KEY` - OpenAI API key (if using AI features)
- `SMTP_*` - Email service credentials
- `NEXT_PUBLIC_API_URL` - Production API URLs

### Deployment Platforms

**Recommended:**
- **Vercel** - Best for Next.js apps
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS with Docker
- **AWS** - Scalable cloud infrastructure

### Docker Deployment (Optional)

```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up -d
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Ensure all tests pass
6. Submit a pull request

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages (Conventional Commits)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- shadcn for beautiful UI components
- Playwright for reliable testing

## 📞 Support

- 📧 Email: support@migo.com
- 💬 Discord: [Join our community](https://discord.gg/migo)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/migo/issues)

## 🗺 Roadmap

- [ ] Mobile apps (React Native)
- [ ] Video conferencing integration
- [ ] Advanced AI tutor
- [ ] Gamification features
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)

---

**Made with ❤️ by the Migo Team**
