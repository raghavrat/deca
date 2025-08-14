'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, RefreshCw, Trophy, ClipboardList, ChevronUp, ChevronDown, Sparkles, Video, Play, Square, Upload, RotateCcw, Image, X, Mic } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Import ReactMediaRecorder dynamically to avoid SSR issues
const ReactMediaRecorder = dynamic(
  () => import('react-media-recorder').then(mod => mod.ReactMediaRecorder),
  { ssr: false }
)
import { DECAScenario } from '../../types'
import { getInstructionalAreasByCategory, InstructionalArea } from '../../utils/instructionalAreas'
import { getEventById } from '../../data/decaEvents'
import { useAuth } from '../../context/AuthContext'

const categoryDisplayNames: { [key: string]: string } = {
  managment: 'Management',
  marketing: 'Marketing',
  finance: 'Finance',
  hospitiality: 'Hospitality',
  entrepreneur: 'Entrepreneurship'
}

export default function CategoryRoleplayPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const category = params.category as string
  const eventId = searchParams.get('event')

  const [scenario, setScenario] = useState<DECAScenario | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInstructionalAreaSelection, setShowInstructionalAreaSelection] = useState(true)
  const [instructionalAreas, setInstructionalAreas] = useState<InstructionalArea[]>([])
  const [selectedInstructionalArea, setSelectedInstructionalArea] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [showScoring, setShowScoring] = useState(false)
  const [scores, setScores] = useState<{ [key: string]: number }>({})
  
  // Audio recording states
  const [showAudioRecording, setShowAudioRecording] = useState(false)
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  
  // Image context states
  const [contextImages, setContextImages] = useState<Array<{id: string, file: File, preview: string}>>([])

  const displayName = categoryDisplayNames[category] || category
  const selectedEvent = eventId ? getEventById(eventId) : null

  // Get time limit based on category
  const getTimeLimitMinutes = () => {
    const timeLimits: { [key: string]: number } = {
      managment: 15,
      marketing: 15,
      finance: 15,
      hospitiality: 10,
      entrepreneur: 15
    }
    return timeLimits[category] || 15
  }

  // Format recording duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Submit video for processing
  const submitVideoForGrading = async (videoBlob: Blob) => {
    if (!scenario) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('video', videoBlob, 'roleplay-recording.webm')
      formData.append('scenarioData', JSON.stringify({
        id: scenario.id,
        eventCode: scenario.eventCode,
        performanceIndicators: scenario.performanceIndicators,
        centurySkills: scenario.centurySkills,
        category: category.toUpperCase(),
        eventId: eventId,
        selectedInstructionalArea: selectedInstructionalArea
      }))

      const response = await fetch('/api/roleplay/process', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Failed to submit video: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Video submitted successfully:', result)
      setSubmitSuccess(true)
      
      // Reset recording states after successful submission
      setTimeout(() => {
        setShowAudioRecording(false)
        setRecordedAudioBlob(null)
        setSubmitSuccess(false)
      }, 3000)

    } catch (err) {
      console.error('Error submitting video:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit video for grading')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateScenario = async () => {
    if (!selectedInstructionalArea) {
      setError('Please select an instructional area')
      return
    }

    console.log('generateScenario called - category:', category, 'eventId:', eventId, 'instructionalArea:', selectedInstructionalArea)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/roleplay/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category.toUpperCase(),
          eventId: eventId,
          selectedInstructionalArea: selectedInstructionalArea
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit error
          throw new Error(`Rate limit exceeded. Please wait a few minutes before generating another scenario.`)
        }
        throw new Error(data.error || 'Failed to generate scenario')
      }

      setScenario(data.scenario)
      setShowInstructionalAreaSelection(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }



  // Timer effect for recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (recordingStartTime) {
      interval = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - recordingStartTime.getTime()) / 1000))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [recordingStartTime])

  useEffect(() => {
    console.log('useEffect triggered - loading events for category:', category)
    try {
      // Load instructional areas for this category
      const areas = getInstructionalAreasByCategory(category.toUpperCase())
      console.log('Found instructional areas:', areas.length, areas)
      setInstructionalAreas(areas)
      setShowInstructionalAreaSelection(true)
      setScenario(null)
      setError(null)
    } catch (err) {
      console.error('Error loading instructional areas:', err)
      setError('Failed to load instructional areas')
      setShowInstructionalAreaSelection(false)
    }
  }, [category])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/roleplay"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#0066cc] dark:hover:text-[#4d94ff] transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Categories
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{displayName} Roleplay</h1>
              {selectedEvent && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                  <Trophy className="h-4 w-4 mr-1" />
                  {selectedEvent.name} ({selectedEvent.id})
                </p>
              )}
            </div>
          </div>
          {!showInstructionalAreaSelection && (
            <div className="flex flex-col items-end">
              <button
                onClick={() => {
                  setShowInstructionalAreaSelection(true)
                  setScenario(null)
                }}
                className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-[15px] shadow-md transition-colors mr-2 mb-2 click-animation"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change Instructional Area
              </button>
              <button
                onClick={generateScenario}
                disabled={loading || !selectedInstructionalArea}
                className="flex items-center px-4 py-2 bg-[#0066cc] hover:bg-blue-700 text-white font-semibold rounded-[15px] shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] disabled:opacity-50 click-animation"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Generate New Scenario
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Please use responsibly - limited to 1 per 5 minutes</p>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded-[15px] mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-[15px] shadow-md p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#0066cc]" />
            <p className="text-gray-600 dark:text-gray-400">Generating your roleplay scenario...</p>
          </div>
        )}


        {/* Instructional Area Selection */}
        {showInstructionalAreaSelection && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-[15px] shadow-lg p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0066cc]/10 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-[#0066cc]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Select an Instructional Area</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose an instructional area to focus your {displayName.toLowerCase()} roleplay scenario
                {selectedEvent && (
                  <span className="block mt-1 text-sm">
                    Event: <span className="font-medium">{selectedEvent.name} ({selectedEvent.id})</span>
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instructional Area
                </label>
                
                {/* Selected Area Display */}
                {selectedInstructionalArea && (
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-600 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-400">
                          {selectedInstructionalArea === 'RANDOM' ? '🎲 Random Selection' : selectedInstructionalArea}
                        </p>
                        {selectedInstructionalArea !== 'RANDOM' && (
                          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                            {instructionalAreas.find(a => a.name === selectedInstructionalArea)?.piCount || 0} performance indicators
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedInstructionalArea('')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Dropdown Toggle Button */}
                {!selectedInstructionalArea && (
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] flex justify-between items-center click-animation"
                  >
                    <span>Choose an instructional area</span>
                    {isDropdownOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </button>
                )}
                
                {/* Dropdown Options */}
                <div className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                  isDropdownOpen && !selectedInstructionalArea
                    ? 'max-h-[500px] opacity-100 transform translate-y-0' 
                    : 'max-h-0 opacity-0 transform -translate-y-2'
                }`}>
                  {/* Random Option */}
                  <button
                    onClick={() => {
                      setSelectedInstructionalArea('RANDOM')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 flex items-center justify-center click-animation"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Random Selection
                  </button>
                  
                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or choose specific area</span>
                    </div>
                  </div>
                  
                  {/* Instructional Areas */}
                  <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1">
                    {instructionalAreas.map((area) => (
                      <button
                        key={area.code}
                        onClick={() => {
                          setSelectedInstructionalArea(area.name)
                          setIsDropdownOpen(false)
                        }}
                        className="w-full bg-[#0066cc] hover:bg-[#0052a3] dark:hover:bg-[#6ba3ff] text-white font-semibold py-3 px-6 rounded-[15px] shadow-md text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] flex justify-between items-center click-animation"
                      >
                        <span>{area.name}</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          {area.piCount} PIs
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={generateScenario}
                  disabled={!selectedInstructionalArea || loading}
                  className="w-full px-8 py-4 bg-[#0066cc] hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center click-animation"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating Scenario...
                    </>
                  ) : (
                    <>
                      <Trophy className="h-5 w-5 mr-2" />
                      Generate Roleplay Scenario
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                  ⏱️ Limited to 1 scenario per 5 minutes • Please use responsibly
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Official DECA Format Display */}
        {scenario && !loading && !showInstructionalAreaSelection && (
          <div className="space-y-6">
            {/* Header Information */}
            <div className="bg-white dark:bg-gray-800 rounded-[15px] shadow-md p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{scenario.eventCode}</h2>
                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                  <p><strong>CAREER CLUSTER:</strong> {scenario.careerCluster}</p>
                  <p><strong>CAREER PATHWAY:</strong> {scenario.careerPathway}</p>
                </div>
              </div>

              {/* Participant Instructions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">PARTICIPANT INSTRUCTIONS</h3>
                <div className="space-y-2">
                  {scenario.participantInstructions.map((instruction, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300">• {instruction}</p>
                  ))}
                </div>
              </div>

              {/* 21st Century Skills */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">21st CENTURY SKILLS</h3>
                <div className="space-y-2">
                  {scenario.centurySkills.map((skill, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300">• {skill}</p>
                  ))}
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">PERFORMANCE INDICATORS</h3>
                <div className="space-y-2">
                  {scenario.performanceIndicators.map((indicator, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300">{index + 1}. {indicator}</p>
                  ))}
                </div>
              </div>

              {/* Event Situation */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">EVENT SITUATION</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>{scenario.eventSituation.roleDescription}</p>
                  <p>{scenario.eventSituation.companyBackground}</p>
                  <p>{scenario.eventSituation.businessChallenge}</p>
                  <p>{scenario.eventSituation.taskDescription}</p>
                  <p>{scenario.eventSituation.presentationContext}</p>
                </div>
              </div>

              {/* Judge Instructions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">JUDGE'S INSTRUCTIONS</h3>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">JUDGE ROLE-PLAY CHARACTERIZATION</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{scenario.judgeInstructions.roleCharacterization}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">QUESTIONS TO ASK DURING ROLEPLAY</h4>
                  <div className="space-y-2">
                    {scenario.judgeInstructions.questionsToAsk.map((question, index) => (
                      <p key={index} className="text-gray-700 dark:text-gray-300">{index + 1}. {question}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">EVALUATION CRITERIA</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{scenario.judgeInstructions.evaluationCriteria}</p>
                </div>
              </div>

              {/* Total Score Display */}
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-8">
                <p className="text-xl font-bold text-gray-800 dark:text-white">TOTAL SCORE: {Object.values(scores).reduce((sum, score) => sum + score, 0).toFixed(0)} / 100</p>
              </div>

              <div className="text-center space-y-4">
                <button
                  onClick={() => setShowAudioRecording(true)}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-[15px] shadow-md transition-colors flex items-center mx-auto click-animation"
                >
                  <Video className="h-5 w-5 mr-2" />
                  Start Audio Practice
                </button>
                <button
                  onClick={() => setShowScoring(true)}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-[15px] shadow-md transition-colors flex items-center mx-auto click-animation"
                >
                  <ClipboardList className="h-5 w-5 mr-2" />
                  Grade Performance
                </button>
              </div>
            </div>



            {/* Scoring Modal */}
            {showScoring && scenario && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-[15px] shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Score Performance - {scenario.eventCode}</h3>
                      <button
                        onClick={() => setShowScoring(false)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Performance Indicators Scoring */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Performance Indicators (0-14 points each)</h4>
                      <div className="space-y-4">
                        {scenario.performanceIndicators.map((indicator, index) => (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">{index + 1}. {indicator}</p>
                            <div className="flex items-center space-x-4">
                              <input
                                type="number"
                                min="0"
                                max="14"
                                step="1"
                                value={scores[`indicator-${index}`] || 0}
                                onChange={(e) => {
                                  const value = Math.min(14, Math.max(0, parseInt(e.target.value) || 0));
                                  setScores(prev => ({ ...prev, [`indicator-${index}`]: value }));
                                }}
                                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400">/ 14 points</span>
                              <div className="flex-1 flex space-x-2 text-xs">
                                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded">0-4: Little/No</span>
                                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded">5-8: Below</span>
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">9-11: Meets</span>
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded">12-14: Exceeds</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 21st Century Skills Scoring */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3">21st Century Skills (0-6 points each)</h4>
                      <div className="space-y-4">
                        {scenario.centurySkills.map((skill, index) => (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">{index + 6}. {skill}</p>
                            <div className="flex items-center space-x-4">
                              <input
                                type="number"
                                min="0"
                                max="6"
                                step="1"
                                value={scores[`skill-${index}`] || 0}
                                onChange={(e) => {
                                  const value = Math.min(6, Math.max(0, parseInt(e.target.value) || 0));
                                  setScores(prev => ({ ...prev, [`skill-${index}`]: value }));
                                }}
                                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400">/ 6 points</span>
                              <div className="flex-1 flex space-x-2 text-xs">
                                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded">0-1: Little/No</span>
                                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded">2-3: Below</span>
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">4: Meets</span>
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded">5-6: Exceeds</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Overall Impression */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Overall Impression (0-6 points)</h4>
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">10. Overall impression and responses to the judge's questions</p>
                        <div className="flex items-center space-x-4">
                          <input
                            type="number"
                            min="0"
                            max="6"
                            step="1"
                            value={scores['overall'] || 0}
                            onChange={(e) => {
                              const value = Math.min(6, Math.max(0, parseInt(e.target.value) || 0));
                              setScores(prev => ({ ...prev, overall: value }));
                            }}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">/ 6 points</span>
                          <div className="flex-1 flex space-x-2 text-xs">
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded">0-1: Little/No</span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">2-3: Below</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">4: Meets</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">5-6: Exceeds</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Total Score */}
                    <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Total Score</h4>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">
                        {Object.values(scores).reduce((sum, score) => sum + score, 0)} / 100
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowScoring(false)}
                        className="px-6 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-semibold rounded-[15px] transition-colors click-animation"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Save scores logic here
                          alert(`Performance scored: ${Object.values(scores).reduce((sum, score) => sum + score, 0)}/100`);
                          setShowScoring(false);
                        }}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white font-semibold rounded-[15px] transition-colors click-animation"
                      >
                        Save Score
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Recording Modal */}
            {showAudioRecording && scenario && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-[15px] shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Audio Practice - {scenario.eventCode}
                      </h3>
                      <button
                        onClick={() => {
                          setShowAudioRecording(false)
                          setRecordedAudioBlob(null)
                          setRecordingDuration(0)
                          setContextImages([])
                        }}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        ✕
                      </button>
                    </div>

                    {ReactMediaRecorder ? (
                    <ReactMediaRecorder
                      audio={true}
                      mediaRecorderOptions={{
                        mimeType: 'audio/webm'
                      }}
                      askPermissionOnMount={false}
                      render={({ status, startRecording, stopRecording, mediaBlobUrl, error }) => (
                        <div>
                          {/* Show error if microphone access fails */}
                          {error && (
                            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                              <p className="text-red-700 dark:text-red-300 font-semibold">Microphone Error</p>
                              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                                {error === 'permission_denied' 
                                  ? 'Please allow microphone access in your browser settings' 
                                  : `Error: ${error}`}
                              </p>
                            </div>
                          )}
                          
                          {/* Recording Instructions */}
                          {!recordedAudioBlob && status === 'idle' && (
                            <div className="space-y-4">
                              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Instructions</h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>• Present your solution to the scenario as if speaking to the judge</li>
                                  <li>• Time limit: {getTimeLimitMinutes()} minutes</li>
                                  <li>• Speak clearly and professionally</li>
                                  <li>• Address all performance indicators</li>
                                  <li>• Upload any diagrams or charts you would draw for the judge</li>
                                </ul>
                              </div>

                              {/* Image Upload Section */}
                              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                                  <Image className="w-4 h-4 mr-2" />
                                  Add Context Images (Optional)
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                  Upload diagrams, charts, or visual aids you would show during your presentation
                                </p>
                                
                                {/* Image Preview Grid */}
                                {contextImages.length > 0 && (
                                  <div className="grid grid-cols-3 gap-2 mb-3">
                                    {contextImages.map((img) => (
                                      <div key={img.id} className="relative group">
                                        <img 
                                          src={img.preview} 
                                          alt="Context" 
                                          className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <button
                                          onClick={() => {
                                            setContextImages(prev => prev.filter(i => i.id !== img.id))
                                            URL.revokeObjectURL(img.preview)
                                          }}
                                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <label className="flex items-center justify-center w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                  <Image className="w-5 h-5 mr-2 text-gray-400" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {contextImages.length === 0 ? 'Upload Images' : 'Add More Images'}
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => {
                                      const files = Array.from(e.target.files || [])
                                      const newImages = files.map(file => ({
                                        id: Math.random().toString(36).substr(2, 9),
                                        file,
                                        preview: URL.createObjectURL(file)
                                      }))
                                      setContextImages(prev => [...prev, ...newImages].slice(0, 5)) // Max 5 images
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          )}

                          {/* Audio Playback */}
                          {mediaBlobUrl && recordedAudioBlob && (
                            <div className="mb-6">
                              <audio
                                src={mediaBlobUrl}
                                controls
                                className="w-full"
                              />
                            </div>
                          )}

                          {/* Recording Status */}
                          {status === 'recording' && (
                            <div className="mb-6">
                              <div className="flex items-center justify-center mb-4">
                                <div className="animate-pulse flex items-center space-x-3">
                                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                  <span className="text-red-600 dark:text-red-400 font-medium">Recording...</span>
                                </div>
                              </div>
                              <div className="text-center text-2xl font-mono text-gray-800 dark:text-white">
                                {Math.floor(recordingDuration / 60).toString().padStart(2, '0')}:
                                {(recordingDuration % 60).toString().padStart(2, '0')} / {getTimeLimitMinutes()}:00
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex justify-center space-x-4">
                            {status === 'idle' && !recordedAudioBlob && (
                              <button
                                onClick={async () => {
                                  console.log('Starting recording...')
                                  
                                  // Request microphone permission explicitly
                                  try {
                                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                                    console.log('Microphone access granted')
                                    stream.getTracks().forEach(track => track.stop()) // Stop the test stream
                                  } catch (err) {
                                    console.error('Microphone access denied:', err)
                                    alert('Please allow microphone access to record audio')
                                    return
                                  }
                                  
                                  setRecordingStartTime(new Date())
                                  setRecordingDuration(0)
                                  startRecording()
                                  console.log('Recording started')
                                  
                                  // Start timer
                                  const interval = setInterval(() => {
                                    setRecordingDuration(prev => {
                                      const newDuration = prev + 1
                                      // Auto-stop at time limit
                                      if (newDuration >= getTimeLimitMinutes() * 60) {
                                        stopRecording()
                                        clearInterval(interval)
                                      }
                                      return newDuration
                                    })
                                  }, 1000)
                                }}
                                className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              >
                                <Play className="w-5 h-5 mr-2" />
                                Start Recording
                              </button>
                            )}

                            {status === 'recording' && (
                              <button
                                onClick={stopRecording}
                                className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                              >
                                <Square className="w-5 h-5 mr-2" />
                                Stop Recording
                              </button>
                            )}

                            {recordedAudioBlob && status === 'stopped' && (
                              <>
                                <button
                                  onClick={() => {
                                    setRecordedAudioBlob(null)
                                    setRecordingDuration(0)
                                  }}
                                  className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                  <RotateCcw className="w-5 h-5 mr-2" />
                                  Re-record
                                </button>

                                <button
                                  onClick={async () => {
                                    if (!recordedAudioBlob || !scenario || !user) return
                                    
                                    console.log('Starting submission...', {
                                      hasAudio: !!recordedAudioBlob,
                                      audioSize: recordedAudioBlob.size,
                                      audioType: recordedAudioBlob.type,
                                      hasScenario: !!scenario,
                                      hasUser: !!user,
                                      duration: recordingDuration
                                    })
                                    
                                    setIsSubmitting(true)
                                    try {
                                      // Convert blob to base64
                                      const reader = new FileReader()
                                      reader.readAsDataURL(recordedAudioBlob)
                                      reader.onloadend = async () => {
                                        const base64Audio = reader.result as string
                                        console.log('Audio converted to base64, length:', base64Audio.length)
                                        
                                        // Convert images to base64
                                        const base64Images = await Promise.all(
                                          contextImages.map(async (img) => {
                                            return new Promise<string>((resolve) => {
                                              const imgReader = new FileReader()
                                              imgReader.onloadend = () => resolve(imgReader.result as string)
                                              imgReader.readAsDataURL(img.file)
                                            })
                                          })
                                        )
                                        console.log('Images converted:', base64Images.length)

                                        console.log('Sending request to API...')
                                        const response = await fetch('/api/roleplay/process', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            audio: base64Audio,
                                            images: base64Images,
                                            scenario,
                                            category: displayName,
                                            duration: recordingDuration,
                                            userId: user.uid,
                                            userEmail: user.email
                                          })
                                        })

                                        console.log('Response status:', response.status)
                                        
                                        if (!response.ok) {
                                          const errorData = await response.json()
                                          console.error('API Error response:', errorData)
                                          
                                          // Check for silent audio error
                                          if (errorData.error === 'silent_audio') {
                                            alert(errorData.message || 'No audio detected in your recording. Please ensure your microphone is working and try again.')
                                            // Reset recording states for retry
                                            setRecordedAudioBlob(null)
                                            setRecordingDuration(0)
                                            setIsSubmitting(false)
                                            return
                                          }
                                          
                                          throw new Error(errorData.message || errorData.error || `Failed to process audio`)
                                        }
                                        
                                        const responseData = await response.json()
                                        console.log('Response data received:', {
                                          success: responseData.success,
                                          sessionId: responseData.sessionId,
                                          userEmail: responseData.userEmail
                                        })
                                        
                                        const { sessionId, userEmail } = responseData
                                        
                                        if (!sessionId) {
                                          throw new Error('No session ID returned from API')
                                        }
                                        
                                        // Navigate to review page with just session ID
                                        console.log('Navigating to review page with session ID:', sessionId)
                                        router.push(`/roleplay/review?id=${sessionId}`)
                                      }
                                      
                                      reader.onerror = (error) => {
                                        console.error('FileReader error:', error)
                                        alert('Failed to read audio file. Please try again.')
                                        setIsSubmitting(false)
                                      }
                                    } catch (error) {
                                      console.error('Error processing audio:', error)
                                      alert(`Failed to process audio: ${error instanceof Error ? error.message : 'Unknown error'}`)
                                      setIsSubmitting(false)
                                    }
                                  }}
                                  disabled={isSubmitting}
                                  className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <Upload className="w-5 h-5 mr-2" />
                                  {isSubmitting ? 'Processing...' : 'Submit for AI Grading'}
                                </button>
                              </>
                            )}
                          </div>

                          {isSubmitting && (
                            <div className="mt-6">
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
                                <div className="flex flex-col items-center space-y-4">
                                  {/* Animated Mic Icon */}
                                  <div className="relative">
                                    <div className="absolute inset-0 animate-ping">
                                      <Mic className="w-12 h-12 text-blue-400 opacity-75" />
                                    </div>
                                    <Mic className="w-12 h-12 text-blue-600 dark:text-blue-400 relative" />
                                  </div>
                                  
                                  {/* Progress Steps */}
                                  <div className="w-full max-w-md">
                                    <div className="flex justify-between mb-2">
                                      <span className="text-xs text-gray-600 dark:text-gray-400">Transcribing Audio</span>
                                      <span className="text-xs text-gray-600 dark:text-gray-400">Analyzing Performance</span>
                                      <span className="text-xs text-gray-600 dark:text-gray-400">Generating Feedback</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                                    </div>
                                  </div>
                                  
                                  <div className="text-center">
                                    <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                                      AI Judge is reviewing your performance...
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      This typically takes 30-60 seconds
                                    </p>
                                  </div>
                                  
                                  {/* Fun Facts While Waiting */}
                                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 max-w-sm">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                      💡 Did you know? DECA has over 200,000 members across 3,500 schools!
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      onStop={(blobUrl, blob) => {
                        console.log('Recording stopped:', {
                          blobUrl,
                          blobSize: blob.size,
                          blobType: blob.type
                        })
                        if (blob.size === 0) {
                          console.error('Recording blob is empty!')
                          alert('Recording failed - no audio data captured. Please check your microphone.')
                        }
                        setRecordedAudioBlob(blob)
                      }}
                    />
                    ) : (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading recording interface...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}