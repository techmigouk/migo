"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      question: "What are your goals?",
      options: ["Get a tech job", "Start freelancing", "Build a product", "Just explore"],
    },
    {
      question: "How familiar are you with coding or design?",
      options: ["Complete beginner", "Some experience", "Comfortable with basics", "Advanced"],
    },
    {
      question: "Which skills interest you most?",
      options: ["Web Development", "Data Science", "UI/UX Design", "AI & Machine Learning"],
    },
    {
      question: "How do you prefer to learn?",
      options: ["Short videos", "Interactive coding", "Projects", "Mentorship"],
    },
    {
      question: "How much time can you dedicate weekly?",
      options: ["Less than 3 hours", "3-6 hours", "6-10 hours", "10+ hours"],
    },
  ]

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      setTimeout(() => setShowResults(true), 300)
    }
  }

  const recommendations = [
    {
      title: "Frontend Developer Path",
      description: "A hands-on path for creative builders who love visuals and design.",
      courses: "HTML/CSS, JavaScript, React Projects",
      duration: "3-4 months",
    },
    {
      title: "Data Science Foundations",
      description: "Perfect for analytical minds who love working with data.",
      courses: "Python, Data Analysis, Visualization",
      duration: "4-5 months",
    },
  ]

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1f44] to-[#121826] py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Your Personalized Learning Path</h1>
            <p className="text-[#d1d5db] text-lg">
              Here's where we recommend you start — based on your interests and goals
            </p>
          </div>

          <div className="space-y-6 mb-12">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-[#121826] p-8 rounded-xl hover:outline hover:outline-2 hover:outline-[#f59e0b] hover:shadow-xl hover:shadow-[#f59e0b]/20 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-3">{rec.title}</h3>
                <p className="text-[#d1d5db] mb-4">{rec.description}</p>
                <div className="flex items-center gap-4 text-[#d1d5db] text-sm mb-6">
                  <span>📚 {rec.courses}</span>
                  <span>⏱ {rec.duration}</span>
                </div>
                <Link
                  href="/courses"
                  className="inline-block px-6 py-3 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
                >
                  Start Learning
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-[#0a1f44] mb-4">Ready to Begin?</h2>
            <p className="text-[#0a1f44] mb-6">
              Your personalized path is waiting. Let's start your first course today.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-[#0a1f44] text-white font-semibold rounded-lg hover:bg-[#121826] transition-all duration-300"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1f44] to-[#121826] py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Not sure where to start? Let's find your perfect course.
          </h1>
          <p className="text-[#d1d5db] text-lg">
            Answer a few quick questions and we'll match you with the best learning path
          </p>
          <p className="text-[#d1d5db] text-sm mt-2">Takes less than 2 minutes</p>
        </div>

        <div className="bg-[#121826] p-8 rounded-2xl">
          <div className="mb-6">
            <div className="flex justify-between text-[#d1d5db] text-sm mb-2">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-[#0a1f44] rounded-full h-2">
              <div
                className="bg-[#f59e0b] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8">{questions[currentQuestion].question}</h2>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full p-4 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] hover:border-[#f59e0b] hover:bg-[#f59e0b]/10 transition-all duration-300 text-left font-medium"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
              className="px-6 py-3 border-2 border-[#f59e0b] text-[#f59e0b] font-semibold rounded-lg hover:bg-[#f59e0b]/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
