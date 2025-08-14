'use client'

import { useState, useEffect } from 'react'
import { questions, Question } from '../../questions'
import { useAuth } from '../../context/AuthContext'
import { doc, getDoc, setDoc, increment } from 'firebase/firestore'
import { db } from '../../firebase/config'

type PageProps = {
 params: Promise<{
   category: string
 }>
 searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function TestPage({ params, searchParams }: PageProps) {
 const { user } = useAuth()
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

 const updateQuestionStats = async (isCorrect: boolean) => {
   if (!user) return

   const statsKey = `questionStats_${user.uid}`

   // Update Firestore only if the answer is correct
   if (isCorrect) {
     const userDocRef = doc(db, 'users', user.uid)
     try {
       await setDoc(userDocRef, { problemsCompleted: increment(1) }, { merge: true })
     } catch (error) {
       console.error('Error updating problems completed count:', error)
     }
   }
   const existingStats = localStorage.getItem(statsKey)
   
   let stats = existingStats ? JSON.parse(existingStats) : {
     totalQuestions: 0,
     byCategory: {},
     lastAttempt: null,
     streak: 0
   }

   // Update total questions
   stats.totalQuestions += 1

   // Update category count
   const categoryUpper = category.toUpperCase()
   
   // Handle both old format (number) and new format (object)
   if (typeof stats.byCategory[categoryUpper] === 'object') {
     // If it's an object from the previous implementation, just increment the total
     stats.byCategory[categoryUpper].total = (stats.byCategory[categoryUpper].total || 0) + 1
   } else {
     // If it's a number or doesn't exist, treat it as a number
     stats.byCategory[categoryUpper] = (stats.byCategory[categoryUpper] || 0) + 1
   }

   // Update streak
   const today = new Date().toDateString()
   const lastAttemptDate = stats.lastAttempt ? new Date(stats.lastAttempt).toDateString() : null
   
   if (lastAttemptDate === today) {
     // Already attempted today, maintain streak
   } else if (lastAttemptDate) {
     const yesterday = new Date()
     yesterday.setDate(yesterday.getDate() - 1)
     if (lastAttemptDate === yesterday.toDateString()) {
       // Attempted yesterday, increment streak
       stats.streak = (stats.streak || 0) + 1
     } else {
       // Missed days, reset streak
       stats.streak = 1
     }
   } else {
     // First attempt
     stats.streak = 1
   }

   // Update last attempt
   stats.lastAttempt = new Date().toISOString()

   // Save to localStorage
   localStorage.setItem(statsKey, JSON.stringify(stats))
 }

 const handleSubmit = () => {
   if (selectedAnswer !== null && currentQuestion) {
     const isCorrect = selectedAnswer === currentQuestion.answerType
     setShowResults(true)
     updateQuestionStats(isCorrect)
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
     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
       <div className="max-w-3xl mx-auto">
         <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">No questions found</h1>
         <p className="text-center text-gray-600 dark:text-gray-400">Category: {category}</p>
       </div>
     </div>
   )
 }

 return (
   <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center pt-8 pb-12">
     <div className="w-full max-w-2xl mx-auto px-4">
       <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">{currentQuestion.category} Practice Test</h1>
       
       <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-[15px] p-6 mb-8 transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
         <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">{currentQuestion.text}</h2>
         
         <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showResults ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
           <p className="text-gray-600 dark:text-gray-400">{currentQuestion.explanation}</p>
         </div>
         
         <div className="space-y-4">
           {currentQuestion.answers.map((answer, index) => (
             <button
               key={index}
               onClick={() => !showResults && setSelectedAnswer(index)} 
               className={`w-full text-left p-4 rounded-[15px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] dark:focus:ring-[#4d94ff] click-animation ${
                 selectedAnswer === index && !showResults
                   ? 'bg-blue-500 text-white shadow-md'
                   : showResults
                   ? currentQuestion.answerType === index
                     ? 'bg-green-500 text-white shadow-md'
                     : selectedAnswer === index
                     ? 'bg-red-500 text-white shadow-md'
                     : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                   : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
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
           className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] dark:focus:ring-[#4d94ff] click-animation"
           disabled={selectedAnswer === null}
         >
           Submit Answer
         </button>
       ) : (
         <button
           onClick={getNextQuestion}
           className="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-[#0066cc] dark:text-[#4d94ff] font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] dark:focus:ring-[#4d94ff] click-animation"
         >
           Next Question
         </button>
       )}
     </div>
   </div>
 )
}