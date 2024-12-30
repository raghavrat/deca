'use client'

import { useState } from 'react'
import { questions, Question } from '../questions'

export default function TestPage() {
  const [remainingQuestions, setRemainingQuestions] = useState([...questions])
  const [currentQuestion, setCurrentQuestion] = useState(remainingQuestions[0])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResults(true)
    }
  }

  const getNextQuestion = () => {
    // Reset states
    setSelectedAnswer(null)
    setShowResults(false)

    if (remainingQuestions.length <= 1) {
      setRemainingQuestions([...questions])
      setCurrentQuestion(questions[0])
      return
    }
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length)
    const nextQuestion = remainingQuestions[randomIndex]
    setRemainingQuestions(remainingQuestions.filter((_, index) => index !== randomIndex))
    setCurrentQuestion(nextQuestion)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-8 pb-12">
      <div className="w-full max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Practice Test</h1>
        
        <div className="bg-white shadow-lg rounded-[15px] p-6 mb-8 transition-all duration-300 ease-in-out">
          {currentQuestion && (
            <h2 className="text-xl font-semibold mb-4 text-gray-700">{currentQuestion.text}</h2>
          )}
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showResults ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
            <p className="text-gray-600">{currentQuestion.explanation}</p>
          </div>
          
          <div className="space-y-4">
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => !showResults && setSelectedAnswer(index)}
                className={`w-full text-left p-4 rounded-[15px] transition-all duration-300 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C167] ${
                  selectedAnswer === index && !showResults
                    ? 'bg-blue-500 text-white shadow-md'
                    : showResults
                    ? currentQuestion.answerType === index
                      ? 'bg-green-500 text-white shadow-md'
                      : selectedAnswer === index
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                disabled={showResults}
              >
                {answer.text}
              </button>
            ))}
          </div>
        </div>

        {!showResults ? (
          <button
            onClick={handleSubmit}
            className="w-full bg-[#06C167] hover:bg-[#05a75a] text-white font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C167]"
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={getNextQuestion}
            className="w-full bg-white hover:bg-gray-50 text-[#06C167] font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C167]"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  )
}

