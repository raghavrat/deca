'use client'

import { useState, useEffect } from 'react'
import { questions, Question } from '../../questions'

type PageProps = {
 params: Promise<{
   category: string
 }>
 searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function TestPage({ params, searchParams }: PageProps) {
 const [category, setCategory] = useState('')
 const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
 const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([])
 const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
 const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
 const [showResults, setShowResults] = useState(false)
 const [isTransitioning, setIsTransitioning] = useState(false)

 useEffect(() => {
   const initParams = async () => {
     const resolvedParams = await params
     setCategory(resolvedParams.category)
     const filtered = questions.filter(q => 
       q.category.toLowerCase() === resolvedParams.category.toLowerCase()
     )
     const shuffled = [...filtered].sort(() => Math.random() - 0.5)
     setFilteredQuestions(filtered)
     setRemainingQuestions(shuffled)
     setCurrentQuestion(shuffled[0])
   }
   initParams()
 }, [params])

 const handleSubmit = () => {
   if (selectedAnswer !== null) {
     setShowResults(true)
   }
 }

 const getNextQuestion = () => {
   setIsTransitioning(true)
   setSelectedAnswer(null)
   setShowResults(false)
   
   setTimeout(() => {
     if (remainingQuestions.length <= 1) {
       const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5)
       setRemainingQuestions(shuffled)
       setCurrentQuestion(shuffled[0])
     } else {
       const randomIndex = Math.floor(Math.random() * remainingQuestions.length)
       const nextQuestion = remainingQuestions[randomIndex]
       setRemainingQuestions(remainingQuestions.filter((_, index) => index !== randomIndex))
       setCurrentQuestion(nextQuestion)
     }
     setIsTransitioning(false)
   }, 300)
 }

 if (!currentQuestion) return null

 if (filteredQuestions.length === 0) {
   return (
     <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
       <div className="max-w-3xl mx-auto">
         <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">No questions found</h1>
         <p className="text-center text-gray-600">Category: {category}</p>
       </div>
     </div>
   )
 }

 return (
   <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-8 pb-12">
     <div className="w-full max-w-2xl mx-auto px-4">
       <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">{currentQuestion.category} Practice Test</h1>
       
       <div className={`bg-white shadow-lg rounded-[15px] p-6 mb-8 transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
         <h2 className="text-xl font-semibold mb-4 text-gray-700">{currentQuestion.text}</h2>
         
         <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showResults ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
           <p className="text-gray-600">{currentQuestion.explanation}</p>
         </div>
         
         <div className="space-y-4">
           {currentQuestion.answers.map((answer, index) => (
             <button
               key={index}
               onClick={() => !showResults && setSelectedAnswer(index)} 
               className={`w-full text-left p-4 rounded-[15px] transition-all duration-300 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] ${
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
           className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc]"
           disabled={selectedAnswer === null}
         >
           Submit Answer
         </button>
       ) : (
         <button
           onClick={getNextQuestion}
           className="w-full bg-white hover:bg-gray-50 text-[#0066cc] font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc]"
         >
           Next Question
         </button>
       )}
     </div>
   </div>
 )
}