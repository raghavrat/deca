'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, TrendingUp, AlertCircle, CheckCircle, Clock, MessageSquare, Star, Target, FileText } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface SessionData {
  userId: string
  userEmail: string
  scenario: any
  category: string
  duration: number
  transcript: Array<{ timestamp: string; text: string }>
  actions: Array<{ timestamp: string; action: string }>
  scores: {
    performanceIndicators: Array<{
      indicator: string
      score: number
      feedback: string
    }>
    centurySkills: Array<{
      skill: string
      score: number
      feedback: string
    }>
    overallImpression: {
      score: number
      feedback: string
    }
    total: number
  }
  timestampedFeedback: Array<{
    timestamp: string
    type: 'positive' | 'improvement'
    feedback: string
  }>
  strengths: string[]
  improvements: string[]
  processedAt: string
}

function RoleplayReviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [activeTab, setActiveTab] = useState<'transcript' | 'scores' | 'feedback' | 'scenario'>('scores')

  useEffect(() => {
    const fetchSessionData = async () => {
      // Get session ID from URL parameters
      const sessionId = searchParams.get('id')
      
      console.log('Review page loaded with session ID:', sessionId)
      
      if (!sessionId) {
        console.error('No session ID found in URL')
        router.push('/roleplay')
        return
      }
      
      if (!user) {
        console.error('No user logged in')
        router.push('/login')
        return
      }

      try {
        console.log('Fetching session data via API for user:', user.email)
        
        // Fetch the roleplay data through the API endpoint
        const response = await fetch(`/api/roleplay/get?id=${sessionId}&email=${encodeURIComponent(user.email!)}`)
        
        if (!response.ok) {
          const error = await response.json()
          console.error('API error:', error)
          alert(`Failed to load session: ${error.error}`)
          router.push('/roleplay')
          return
        }
        
        const { data: sessionData } = await response.json()
        
        console.log('Session data retrieved:', {
          hasScores: !!sessionData.scores,
          hasTranscript: !!sessionData.transcript,
          totalScore: sessionData.scores?.total
        })
        
        // Add userEmail to match the expected interface
        const completeSessionData = {
          ...sessionData,
          userEmail: user.email
        } as SessionData
        
        setSessionData(completeSessionData)
        console.log('Session data set successfully')
      } catch (error) {
        console.error('Error fetching session data:', error)
        alert('Failed to load review data. Redirecting back to roleplay page.')
        router.push('/roleplay')
      }
    }

    if (user) {
      fetchSessionData()
    }
  }, [router, searchParams, user])

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100
    if (percentage >= 85) return 'text-green-600 dark:text-green-400'
    if (percentage >= 70) return 'text-blue-600 dark:text-blue-400'
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreLabel = (score: number, max: number) => {
    const percentage = (score / max) * 100
    if (percentage >= 85) return 'Exceeds Expectations'
    if (percentage >= 70) return 'Meets Expectations'
    if (percentage >= 50) return 'Below Expectations'
    return 'Needs Improvement'
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/roleplay"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Roleplay
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">AI Performance Review</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {sessionData.category} • {Math.floor(sessionData.duration / 60)}:{(sessionData.duration % 60).toString().padStart(2, '0')} duration
              </p>
            </div>
          </div>
          <Link
            href={`/roleplay/${sessionData.category.toLowerCase()}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            Practice Another
          </Link>
        </div>

        {/* Score Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Overall Score</h2>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          
          <div className="text-center mb-6">
            <div className={`text-5xl font-bold ${getScoreColor(sessionData.scores?.total || 0, 100)}`}>
              {sessionData.scores?.total || 0}/100
            </div>
            <p className={`text-lg mt-2 ${getScoreColor(sessionData.scores?.total || 0, 100)}`}>
              {getScoreLabel(sessionData.scores?.total || 0, 100)}
            </p>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                (sessionData.scores?.total || 0) >= 85 ? 'bg-green-500' :
                (sessionData.scores?.total || 0) >= 70 ? 'bg-blue-500' :
                (sessionData.scores?.total || 0) >= 50 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${sessionData.scores?.total || 0}%` }}
            ></div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {sessionData.scores?.performanceIndicators?.reduce((sum, pi) => sum + (pi.score || 0), 0) || 0}/
                {(sessionData.scenario?.performanceIndicators?.length || 0) * 14}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Performance Indicators</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {sessionData.scores?.centurySkills?.reduce((sum, skill) => sum + (skill.score || 0), 0) || 0}/
                {(sessionData.scores?.centurySkills?.length || 0) * 6}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">21st Century Skills</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {sessionData.scores?.overallImpression?.score || 0}/6
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overall Impression</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('scores')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'scores'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Target className="w-4 h-4 inline mr-2" />
                Detailed Scores
              </button>
              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'transcript'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Transcript
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'feedback'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Feedback
              </button>
              <button
                onClick={() => setActiveTab('scenario')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'scenario'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Scenario
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Detailed Scores Tab */}
            {activeTab === 'scores' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Performance Indicators</h3>
                  <div className="space-y-3">
                    {sessionData.scenario?.performanceIndicators ? (
                      sessionData.scenario.performanceIndicators.map((piName: string, index: number) => {
                        const piScore = sessionData.scores?.performanceIndicators?.find(
                          (pi: any) => pi.indicator === piName
                        )
                        return (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-medium text-gray-800 dark:text-white flex-1">{piName}</p>
                              <span className={`font-bold ml-4 ${getScoreColor(piScore?.score || 0, 14)}`}>
                                {piScore?.score || 0}/14
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {piScore?.feedback || 'Not graded yet'}
                            </p>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No performance indicators available</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">21st Century Skills</h3>
                  <div className="space-y-3">
                    {sessionData.scenario?.centurySkills ? (
                      sessionData.scenario.centurySkills.map((skillName: string, index: number) => {
                        const skillScore = sessionData.scores?.centurySkills?.find(
                          (skill: any) => skill.skill === skillName
                        )
                        return (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-medium text-gray-800 dark:text-white flex-1">{skillName}</p>
                              <span className={`font-bold ml-4 ${getScoreColor(skillScore?.score || 0, 6)}`}>
                                {skillScore?.score || 0}/6
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {skillScore?.feedback || 'Not graded yet'}
                            </p>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No 21st century skills available</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Overall Impression</h3>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800 dark:text-white">Judge's Overall Assessment</p>
                      <span className={`font-bold ${getScoreColor(sessionData.scores?.overallImpression?.score || 0, 6)}`}>
                        {sessionData.scores?.overallImpression?.score || 0}/6
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{sessionData.scores?.overallImpression?.feedback || 'No feedback available'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Transcript Tab */}
            {activeTab === 'transcript' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Performance Transcript</h3>
                
                {/* Actions/Gestures */}
                {sessionData.actions && sessionData.actions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Presentation Elements</h4>
                    <div className="space-y-2">
                      {(sessionData.actions || []).map((action, index) => (
                        <div key={index} className="flex items-start space-x-3 text-sm">
                          <span className="text-blue-600 dark:text-blue-400 font-mono">{action.timestamp}</span>
                          <span className="text-gray-600 dark:text-gray-400 italic">{action.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transcript */}
                <div className="space-y-2">
                  {(sessionData.transcript || []).map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">{entry.timestamp}</span>
                      <p className="text-gray-700 dark:text-gray-300 flex-1">{entry.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                {/* Strengths */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-green-500" />
                    Strengths
                  </h3>
                  <div className="space-y-2">
                    {(sessionData.strengths || []).map((strength, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-yellow-500" />
                    Areas for Improvement
                  </h3>
                  <div className="space-y-2">
                    {(sessionData.improvements || []).map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timestamped Feedback */}
                {sessionData.timestampedFeedback && sessionData.timestampedFeedback.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-500" />
                      Moment-by-Moment Feedback
                    </h3>
                    <div className="space-y-3">
                      {(sessionData.timestampedFeedback || []).map((feedback, index) => (
                        <div
                          key={index}
                          className={`border-l-4 pl-4 py-2 ${
                            feedback.type === 'positive'
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
                              {feedback.timestamp}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              feedback.type === 'positive'
                                ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                                : 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                            }`}>
                              {feedback.type === 'positive' ? 'Strength' : 'Suggestion'}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{feedback.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scenario Tab */}
            {activeTab === 'scenario' && sessionData.scenario && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Event Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                    <p><strong>Event Code:</strong> {sessionData.scenario.eventCode}</p>
                    <p><strong>Career Cluster:</strong> {sessionData.scenario.careerCluster}</p>
                    <p><strong>Career Pathway:</strong> {sessionData.scenario.careerPathway || 'N/A'}</p>
                  </div>
                </div>

                {sessionData.scenario.eventSituation && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Event Situation</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Your Role</h4>
                        <p className="text-gray-600 dark:text-gray-400">{sessionData.scenario.eventSituation.roleDescription}</p>
                      </div>
                      
                      {sessionData.scenario.eventSituation.companyBackground && (
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Company Background</h4>
                          <p className="text-gray-600 dark:text-gray-400">{sessionData.scenario.eventSituation.companyBackground}</p>
                        </div>
                      )}
                      
                      {sessionData.scenario.eventSituation.businessChallenge && (
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Business Challenge</h4>
                          <p className="text-gray-600 dark:text-gray-400">{sessionData.scenario.eventSituation.businessChallenge}</p>
                        </div>
                      )}
                      
                      {sessionData.scenario.eventSituation.taskDescription && (
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Your Task</h4>
                          <p className="text-gray-600 dark:text-gray-400">{sessionData.scenario.eventSituation.taskDescription}</p>
                        </div>
                      )}
                      
                      {sessionData.scenario.eventSituation.presentationContext && (
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Presentation Context</h4>
                          <p className="text-gray-600 dark:text-gray-400">{sessionData.scenario.eventSituation.presentationContext}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {sessionData.scenario.performanceIndicators && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Performance Indicators</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      {sessionData.scenario.performanceIndicators.map((pi: string, index: number) => (
                        <li key={index}>{pi}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {sessionData.scenario.centurySkills && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">21st Century Skills</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      {sessionData.scenario.centurySkills.map((skill: string, index: number) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {sessionData.scenario.judgeInstructions && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Judge Information</h3>
                    <div className="space-y-4">
                      {sessionData.scenario.judgeInstructions.roleCharacterization && (
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Judge's Role</h4>
                          <p className="text-gray-600 dark:text-gray-400">{sessionData.scenario.judgeInstructions.roleCharacterization}</p>
                        </div>
                      )}
                      
                      {sessionData.scenario.judgeInstructions.questionsToAsk && (
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Questions Judge May Ask</h4>
                          <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
                            {sessionData.scenario.judgeInstructions.questionsToAsk.map((q: string, index: number) => (
                              <li key={index}>{q}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {sessionData.scenario.participantInstructions && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Participant Instructions</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      {sessionData.scenario.participantInstructions.map((instruction: string, index: number) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RoleplayReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <RoleplayReviewContent />
    </Suspense>
  )
}