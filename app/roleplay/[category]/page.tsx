'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, RefreshCw, Trophy, ClipboardList, ChevronUp, ChevronDown, Sparkles, Video, Play, Square, Upload, RotateCcw, Mic, Clock } from 'lucide-react'
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
import { PERSONAL_FINANCE_AREAS } from '../../data/personalFinanceIndicators'
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
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [hasAiProcessingConsent, setHasAiProcessingConsent] = useState(false)
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'scenario' | 'prep' | 'record'>('scenario')
  const [prepTime, setPrepTime] = useState(10) // Default 10 minutes
  const [prepTimeRemaining, setPrepTimeRemaining] = useState(0)
  const [isPrepTimerRunning, setIsPrepTimerRunning] = useState(false)
  const [roleplayDuration, setRoleplayDuration] = useState(10) // Default 10 minutes
  
  const displayName = categoryDisplayNames[category] || category
  const selectedEvent = eventId ? getEventById(eventId) : null

  const generateScenario = async () => {
    if (!selectedInstructionalArea) {
      setError('Please select an instructional area')
      return
    }

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

  // Prep timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPrepTimerRunning && prepTimeRemaining > 0) {
      interval = setInterval(() => {
        setPrepTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPrepTimerRunning(false)
            // Auto-advance to record tab when prep time ends
            setActiveTab('record')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPrepTimerRunning, prepTimeRemaining])

  useEffect(() => {
    try {
      // Load instructional areas for this category
      const areas = selectedEvent?.id === 'PFL'
        ? PERSONAL_FINANCE_AREAS
        : getInstructionalAreasByCategory(category.toUpperCase())
      setInstructionalAreas(areas)
      setSelectedInstructionalArea('')
      setShowInstructionalAreaSelection(true)
      setScenario(null)
      setError(null)
      // Set default times based on event
      if (selectedEvent) {
        setPrepTime(selectedEvent.prepTime || 10)
        setRoleplayDuration(selectedEvent.roleplayDuration || 10)
      }
    } catch {
      setError('Failed to load instructional areas')
      setShowInstructionalAreaSelection(false)
    }
  }, [category, selectedEvent])

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/roleplay"
              className="flex items-center text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Categories
            </Link>
            <div>
              <h1 className="text-3xl font-light text-black dark:text-white">{displayName} Roleplay</h1>
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
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white text-sm font-medium bg-white dark:bg-black transition-colors mr-2 mb-2 click-animation"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change Instructional Area
              </button>
              <button
                onClick={generateScenario}
                disabled={loading || !selectedInstructionalArea}
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white text-sm font-medium bg-white dark:bg-black transition-colors duration-200 focus:outline-none disabled:opacity-50 click-animation"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Generate New Scenario
              </button>
              <div className="mt-2 px-3 py-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                  Rate limit: 1 scenario per 5 minutes
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-1.5"></span>
              </div>
              <p className="ml-3 text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-black dark:text-white" />
            <p className="text-gray-600 dark:text-gray-400">Generating your roleplay scenario...</p>
          </div>
        )}


        {/* Instructional Area Selection */}
        {showInstructionalAreaSelection && !loading && (
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black/10 dark:bg-white/10 mb-4">
                <Trophy className="h-8 w-8 text-black dark:text-white" />
              </div>
              <h2 className="text-2xl font-light text-black dark:text-white mb-2">Select an Instructional Area</h2>
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
                <p id="instructional-area-label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instructional Area
                </p>
                
                {/* Selected Area Display */}
                {selectedInstructionalArea && (
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {selectedInstructionalArea === 'RANDOM' ? '🎲 Random Selection' : selectedInstructionalArea}
                        </p>
                        {selectedInstructionalArea !== 'RANDOM' && (
                          <p className="text-xs text-black dark:text-white mt-1">
                            {instructionalAreas.find(a => a.name === selectedInstructionalArea)?.piCount || 0} performance indicators
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedInstructionalArea('')}
                        className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 text-sm font-medium"
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
                    aria-labelledby="instructional-area-label"
                    aria-expanded={isDropdownOpen}
                    aria-controls="instructional-area-options"
                    className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white text-sm font-medium py-4 px-6 text-center transition-colors duration-200 focus:outline-none flex justify-between items-center click-animation"
                  >
                    <span>Choose an instructional area</span>
                    {isDropdownOpen ? <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
                  </button>
                )}
                
                {/* Dropdown Options */}
                {isDropdownOpen && !selectedInstructionalArea && (
                <div id="instructional-area-options" className="mt-2 max-h-[500px] space-y-2 overflow-hidden">
                  {/* Random Option */}
                  <button
                    onClick={() => {
                      setSelectedInstructionalArea('RANDOM')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black text-sm font-medium py-3 px-6 text-center transition-colors duration-200 focus:outline-none flex items-center justify-center click-animation"
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
                        className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black text-sm font-medium py-3 px-6 text-left transition-colors duration-200 focus:outline-none flex justify-between items-center click-animation"
                      >
                        <span>{area.name}</span>
                        <span className="text-xs bg-white/20 px-2 py-1 ">
                          {area.piCount} PIs
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={generateScenario}
                  disabled={!selectedInstructionalArea || loading}
                  className="w-full px-8 py-4 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white text-sm font-medium bg-white dark:bg-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center click-animation"
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
                <div className="mt-4 p-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                  <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      <span>Rate Limited: 1 scenario per 5 minutes</span>
                    </div>
                    <span className="mx-2 text-gray-400">•</span>
                    <span>Please use responsibly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabbed Interface with Left Sidebar */}
        {scenario && !loading && !showInstructionalAreaSelection && (
          <div className="flex gap-6">
            {/* Left Sidebar Tabs */}
            <div className="w-64 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-4">
              <div className="space-y-2">
                <div
                  className={`w-full text-left px-4 py-3 border transition-colors cursor-default ${
                    activeTab === 'scenario'
                      ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                      : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-500'
                  }`}
                >
                  <div className="flex items-center">
                    <ClipboardList className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Scenario</div>
                      <div className="text-xs opacity-75">Read the case</div>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-full text-left px-4 py-3 border transition-colors cursor-default ${
                    activeTab === 'prep'
                      ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                      : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-500'
                  }`}
                >
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Prep Time</div>
                      <div className="text-xs opacity-75">{prepTime} min timer</div>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-full text-left px-4 py-3 border transition-colors cursor-default ${
                    activeTab === 'record'
                      ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                      : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-500'
                  }`}
                >
                  <div className="flex items-center">
                    <Video className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Record</div>
                      <div className="text-xs opacity-75">{roleplayDuration} min roleplay</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer Settings */}
              <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Timer Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="prep-time" className="text-xs text-gray-600 dark:text-gray-400">Prep Time (minutes)</label>
                    <input
                      id="prep-time"
                      type="number"
                      min="1"
                      max="30"
                      value={prepTime}
                      onChange={(e) => setPrepTime(Math.max(1, Math.min(30, parseInt(e.target.value) || 10)))}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="roleplay-time" className="text-xs text-gray-600 dark:text-gray-400">Roleplay Time (minutes)</label>
                    <input
                      id="roleplay-time"
                      type="number"
                      min="1"
                      max="30"
                      value={roleplayDuration}
                      onChange={(e) => setRoleplayDuration(Math.max(1, Math.min(30, parseInt(e.target.value) || 10)))}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 space-y-6">
              {/* Tab 1: Scenario */}
              {activeTab === 'scenario' && (
                <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-light text-black dark:text-white mb-2">{scenario.eventCode}</h2>
                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                  <p><strong>CAREER CLUSTER:</strong> {scenario.careerCluster}</p>
                  <p><strong>CAREER PATHWAY:</strong> {scenario.careerPathway}</p>
                </div>
                {scenario.practiceMetadata && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="border border-gray-300 dark:border-gray-700 px-2 py-1">{scenario.practiceMetadata.archetypeLabel}</span>
                    <span className="border border-gray-300 dark:border-gray-700 px-2 py-1">{scenario.practiceMetadata.instructionalArea}</span>
                    <span className="border border-gray-300 dark:border-gray-700 px-2 py-1">Unofficial practice case</span>
                  </div>
                )}
              </div>

              {/* Participant Instructions */}
              <div className="mb-8">
                <h3 className="text-lg font-light text-black dark:text-white mb-4">PARTICIPANT INSTRUCTIONS</h3>
                <div className="space-y-2">
                  {scenario.participantInstructions.map((instruction, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300">• {instruction}</p>
                  ))}
                </div>
              </div>

              {/* Career Competencies */}
              <div className="mb-8">
                <h3 className="text-lg font-light text-black dark:text-white mb-4">CAREER COMPETENCIES</h3>
                <div className="space-y-2">
                  {scenario.centurySkills.map((skill, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300">• {skill}</p>
                  ))}
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="mb-8">
                <h3 className="text-lg font-light text-black dark:text-white mb-4">PERFORMANCE INDICATORS</h3>
                <div className="space-y-2">
                  {scenario.performanceIndicators.map((indicator, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300">{index + 1}. {indicator}</p>
                  ))}
                </div>
              </div>

              {/* Event Situation */}
              <div className="mb-8">
                <h3 className="text-lg font-light text-black dark:text-white mb-4">
                  {scenario.practiceMetadata?.format === 'team-decision' ? 'CASE STUDY SITUATION' : 'EVENT SITUATION'}
                </h3>
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
                <h3 className="text-lg font-light text-black dark:text-white mb-4">JUDGE'S INSTRUCTIONS</h3>

                <div className="mb-6">
                  <h4 className="font-light text-black dark:text-white mb-2">JUDGE ROLE-PLAY CHARACTERIZATION</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{scenario.judgeInstructions.roleCharacterization}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-light text-black dark:text-white mb-2">QUESTIONS TO ASK DURING ROLEPLAY</h4>
                  <div className="space-y-2">
                    {scenario.judgeInstructions.questionsToAsk.map((question, index) => (
                      <p key={index} className="text-gray-700 dark:text-gray-300">{index + 1}. {question}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-light text-black dark:text-white mb-2">EVALUATION CRITERIA</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{scenario.judgeInstructions.evaluationCriteria}</p>
                </div>
              </div>

                </div>
              )}

              {/* Tab 2: Prep Time */}
              {activeTab === 'prep' && (
                <div className="space-y-6">
                  {/* Timer Section */}
                  <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-light text-black dark:text-white mb-4">Preparation Time</h2>
                      
                      {/* Timer Display */}
                      <div className="text-5xl font-mono text-black dark:text-white mb-6">
                        {Math.floor(prepTimeRemaining / 60).toString().padStart(2, '0')}:
                        {(prepTimeRemaining % 60).toString().padStart(2, '0')}
                      </div>

                      {/* Timer Controls */}
                      <div className="flex justify-center gap-4">
                        {!isPrepTimerRunning && prepTimeRemaining > 0 && (
                          <button
                            onClick={() => setIsPrepTimerRunning(true)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white bg-white dark:bg-black transition-colors"
                          >
                            <Play className="w-4 h-4 inline mr-2" />
                            Resume
                          </button>
                        )}
                        {isPrepTimerRunning && (
                          <button
                            onClick={() => setIsPrepTimerRunning(false)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white bg-white dark:bg-black transition-colors"
                          >
                            <Square className="w-4 h-4 inline mr-2" />
                            Pause
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setPrepTimeRemaining(prepTime * 60)
                            setIsPrepTimerRunning(false)
                          }}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white bg-white dark:bg-black transition-colors"
                        >
                          <RotateCcw className="w-4 h-4 inline mr-2" />
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Scenario Display During Prep */}
                  <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-8 opacity-90">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-light text-black dark:text-white mb-2">{scenario.eventCode}</h2>
                      <div className="space-y-1 text-gray-600 dark:text-gray-400">
                        <p><strong>CAREER CLUSTER:</strong> {scenario.careerCluster}</p>
                        <p><strong>CAREER PATHWAY:</strong> {scenario.careerPathway}</p>
                      </div>
                    </div>

                    {/* Performance Indicators */}
                    <div className="mb-8">
                      <h3 className="text-lg font-light text-black dark:text-white mb-4">PERFORMANCE INDICATORS</h3>
                      <div className="space-y-2">
                        {scenario.performanceIndicators.map((indicator, index) => (
                          <p key={index} className="text-gray-700 dark:text-gray-300">{index + 1}. {indicator}</p>
                        ))}
                      </div>
                    </div>

                    {/* Event Situation */}
                    <div className="mb-8">
                      <h3 className="text-lg font-light text-black dark:text-white mb-4">
                        {scenario.practiceMetadata?.format === 'team-decision' ? 'CASE STUDY SITUATION' : 'EVENT SITUATION'}
                      </h3>
                      <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                        <p>{scenario.eventSituation.roleDescription}</p>
                        <p>{scenario.eventSituation.companyBackground}</p>
                        <p>{scenario.eventSituation.businessChallenge}</p>
                        <p>{scenario.eventSituation.taskDescription}</p>
                        <p>{scenario.eventSituation.presentationContext}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Record */}
              {activeTab === 'record' && (
                <div className="space-y-6">
                  {/* Judge's Questions Section */}
                  <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-light text-black dark:text-white mb-4">JUDGE'S QUESTIONS</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      The judge may ask you the following questions during or after your presentation:
                    </p>
                    <div className="space-y-3">
                      {scenario.judgeInstructions.questionsToAsk.map((question, index) => (
                        <div key={index} className="flex items-start">
                          <span className="text-black dark:text-white font-medium mr-3">{index + 1}.</span>
                          <p className="text-gray-700 dark:text-gray-300 flex-1">{question}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recording Mode Toggle */}
                  <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setShowAudioRecording(true)
                          setShowScoring(false)
                        }}
                        className={`px-6 py-2 border transition-colors ${
                          showAudioRecording && !showScoring
                            ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                            : 'border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white'
                        }`}
                      >
                        <Video className="h-4 w-4 inline mr-2" />
                        Audio Recording
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowScoring(true)
                          setShowAudioRecording(false)
                        }}
                        className={`px-6 py-2 border transition-colors ${
                          showScoring && !showAudioRecording
                            ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                            : 'border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white'
                        }`}
                      >
                        <ClipboardList className="h-4 w-4 inline mr-2" />
                        Self Score
                      </button>
                    </div>
                  </div>

                  {/* Audio Recording Section - Inline */}
                  {showAudioRecording && !showScoring && (
                    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-8">
                      <h3 className="text-2xl font-light text-black dark:text-white mb-6 text-center">
                        Audio Practice - {scenario.eventCode}
                      </h3>

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
                              <div className="mb-4 p-4 border border-gray-300 dark:border-gray-700">
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
                                <div className="p-4 border border-gray-300 dark:border-gray-700">
                                  <h4 className="font-light text-black dark:text-white mb-2">Instructions</h4>
                                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <li>• Present your solution to the scenario as if speaking to the judge</li>
                                    <li>• Time limit: {roleplayDuration} minutes</li>
                                    <li>• Speak clearly and professionally</li>
                                    <li>• Address all performance indicators</li>
                                    {scenario.practiceMetadata?.format === 'team-decision' && (
                                      <li>• Record both team members in one coordinated presentation</li>
                                    )}
                                    <li>• Your recording stays in this browser until you submit it</li>
                                  </ul>
                                </div>
                              </div>
                            )}

                            {/* Audio Playback */}
                            {mediaBlobUrl && recordedAudioBlob && (
                              <div className="mb-6">
                                <audio
                                  src={mediaBlobUrl}
                                  controls
                                  aria-label="Review your roleplay recording"
                                  className="w-full"
                                />
                                <div className="mt-4 flex items-start gap-3 rounded border border-gray-300 p-4 dark:border-gray-700">
                                  <input
                                    id="ai-processing-consent"
                                    type="checkbox"
                                    checked={hasAiProcessingConsent}
                                    onChange={(event) => setHasAiProcessingConsent(event.target.checked)}
                                    className="mt-1 h-5 w-5"
                                  />
                                  <label htmlFor="ai-processing-consent" className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                                    I agree to send this audio to OpenRouter and its AI model provider for transcription and grading. The audio is not saved by Deca Pal; the transcript and feedback are saved to my account. See the{' '}
                                    <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
                                  </label>
                                </div>
                              </div>
                            )}

                            {/* Recording Status */}
                            {status === 'recording' && (
                              <div className="mb-6">
                                <div className="flex items-center justify-center mb-4">
                                  <div className="animate-pulse flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-black dark:bg-white"></div>
                                    <span className="text-black dark:text-white font-medium">Recording...</span>
                                  </div>
                                </div>
                                <div className="text-center text-2xl font-mono text-gray-800 dark:text-white">
                                  {Math.floor(recordingDuration / 60).toString().padStart(2, '0')}:
                                  {(recordingDuration % 60).toString().padStart(2, '0')} / {roleplayDuration}:00
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-center space-x-4">
                              {status === 'idle' && !recordedAudioBlob && (
                                <button
                                  onClick={async () => {
                                    // Request microphone permission explicitly
                                    try {
                                      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                                      stream.getTracks().forEach(track => track.stop()) // Stop the test stream
                                    } catch {
                                      alert('Please allow microphone access to record audio')
                                      return
                                    }
                                    
                                    setRecordingStartTime(new Date())
                                    setRecordingDuration(0)
                                    startRecording()
                                    // Start timer
                                    const interval = setInterval(() => {
                                      setRecordingDuration(prev => {
                                        const newDuration = prev + 1
                                        // Auto-stop at time limit
                                        if (newDuration >= roleplayDuration * 60) {
                                          stopRecording()
                                          clearInterval(interval)
                                        }
                                        return newDuration
                                      })
                                    }, 1000)
                                  }}
                                  className="flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white text-sm font-medium bg-white dark:bg-black transition-colors"
                                >
                                  <Play className="w-5 h-5 mr-2" />
                                  Start Recording
                                </button>
                              )}

                              {status === 'recording' && (
                                <button
                                  onClick={stopRecording}
                                  className="flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white text-sm font-medium bg-white dark:bg-black transition-colors"
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
                                      setHasAiProcessingConsent(false)
                                    }}
                                    className="flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white text-sm font-medium bg-white dark:bg-black transition-colors"
                                  >
                                    <RotateCcw className="w-5 h-5 mr-2" />
                                    Re-record
                                  </button>

                                  <button
                                    onClick={async () => {
                                      if (!recordedAudioBlob || !scenario || !user || !hasAiProcessingConsent) return
                                      
                                      setIsSubmitting(true)
                                      try {
                                        // Convert blob to base64
                                        const reader = new FileReader()
                                        reader.readAsDataURL(recordedAudioBlob)
                                        reader.onloadend = async () => {
                                          const base64Audio = reader.result as string
                                          const response = await fetch('/api/roleplay/process', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                              audio: base64Audio,
                                              scenario,
                                              category: displayName,
                                              duration: recordingDuration
                                            })
                                          })
                                          
                                          if (!response.ok) {
                                            const errorData = await response.json()
                                            // Check for silent audio error
                                            if (errorData.error === 'silent_audio') {
                                              alert(errorData.message || 'No audio detected in your recording. Please ensure your microphone is working and try again.')
                                              // Reset recording states for retry
                                              setRecordedAudioBlob(null)
                                              setRecordingDuration(0)
                                              setIsSubmitting(false)
                                              return
                                            }
                                            
                                            // Check for grading error
                                            if (errorData.error === 'grading_failed') {
                                              alert(`AI Grading Error: ${errorData.message}\n\n${errorData.details || 'Please try submitting again.'}`)
                                              setIsSubmitting(false)
                                              return
                                            }
                                            
                                            throw new Error(errorData.message || errorData.error || `Failed to process audio`)
                                          }
                                          
                                          const responseData = await response.json()
                                          const { sessionId } = responseData
                                          
                                          if (!sessionId) {
                                            throw new Error('No session ID returned from API')
                                          }
                                          
                                          // Navigate to review page with just session ID
                                          router.push(`/roleplay/review?id=${sessionId}`)
                                        }
                                        
                                        reader.onerror = () => {
                                          alert('Failed to read audio file. Please try again.')
                                          setIsSubmitting(false)
                                        }
                                      } catch (error) {
                                        console.error('Error processing audio:', error)
                                        alert(`Failed to process audio: ${error instanceof Error ? error.message : 'Unknown error'}`)
                                        setIsSubmitting(false)
                                      }
                                    }}
                                    disabled={isSubmitting || !hasAiProcessingConsent}
                                    className="flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white text-sm font-medium bg-white dark:bg-black transition-colors disabled:opacity-50"
                                  >
                                    <Upload className="w-5 h-5 mr-2" />
                                    {isSubmitting ? 'Processing...' : 'Submit for AI Grading'}
                                  </button>
                                </>
                              )}
                            </div>

                            {isSubmitting && (
                              <div className="mt-6">
                                <div className="border border-gray-300 dark:border-gray-700 p-6">
                                  <div className="flex flex-col items-center space-y-4">
                                    {/* Animated Mic Icon */}
                                    <div className="relative">
                                      <div className="absolute inset-0 animate-ping">
                                        <Mic className="w-12 h-12 text-black dark:text-white opacity-75" />
                                      </div>
                                      <Mic className="w-12 h-12 text-black dark:text-white relative" />
                                    </div>
                                    
                                    {/* Progress Steps */}
                                    <div className="w-full max-w-md">
                                      <div className="flex justify-between mb-2">
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Transcribing Audio</span>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Analyzing Performance</span>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Generating Feedback</span>
                                      </div>
                                      <div className="w-full border border-gray-300 dark:border-gray-700 h-2">
                                        <div className="bg-black dark:bg-white h-2  animate-pulse" style={{width: '60%'}}></div>
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
                                    
                                    {/* Prompt While Waiting */}
                                    <div className="border border-gray-300 dark:border-gray-700 p-3 max-w-sm">
                                      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                        Tip: Think of one strength and one improvement area in your presentation.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        onStop={(blobUrl, blob) => {
                          if (blob.size === 0) {
                            alert('Recording failed - no audio data captured. Please check your microphone.')
                          }
                          setRecordedAudioBlob(blob)
                        }}
                      />
                      ) : (
                        <div className="text-center py-8">
                          <div className="animate-spin  h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
                          <p className="text-gray-600 dark:text-gray-400">Loading recording interface...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Self Scoring Section - Inline */}
                  {showScoring && !showAudioRecording && scenario && (
                    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-8">
                      <h3 className="text-2xl font-light text-black dark:text-white mb-6 text-center">Score Performance - {scenario.eventCode}</h3>

                      {/* Performance Indicators Scoring */}
                      <div className="mb-6">
                        <h4 className="font-light text-black dark:text-white mb-3">Performance Indicators</h4>
                        <div className="space-y-4">
                          {scenario.performanceIndicators.map((indicator, index) => (
                            <div key={index} className="border border-gray-300 dark:border-gray-700 p-4">
                              <p className="font-light text-black dark:text-white mb-2">{index + 1}. {indicator}</p>
                              <div className="flex items-center space-x-4">
                                <input
                                  aria-label={`Self score for performance indicator ${index + 1}: ${indicator}`}
                                  type="number"
                                  min="0"
                                  max={scenario.scoringRubric.performanceIndicators[index]?.maxPoints || 14}
                                  step="1"
                                  value={scores[`indicator-${index}`] || 0}
                                  onChange={(e) => {
                                    const maximum = scenario.scoringRubric.performanceIndicators[index]?.maxPoints || 14
                                    const value = Math.min(maximum, Math.max(0, parseInt(e.target.value) || 0));
                                    setScores(prev => ({ ...prev, [`indicator-${index}`]: value }));
                                  }}
                                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none bg-white dark:bg-black text-black dark:text-white"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">/ {scenario.scoringRubric.performanceIndicators[index]?.maxPoints || 14} points</span>
                                <div className="flex-1 flex space-x-2 text-xs">
                                  <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-black dark:text-white">{scenario.scoringRubric.performanceIndicators[index]?.levels.little.points}: Little/No</span>
                                  <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-black dark:text-white">{scenario.scoringRubric.performanceIndicators[index]?.levels.below.points}: Below</span>
                                  <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-black dark:text-white">{scenario.scoringRubric.performanceIndicators[index]?.levels.meets.points}: Meets</span>
                                  <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-black dark:text-white">{scenario.scoringRubric.performanceIndicators[index]?.levels.exceeds.points}: Exceeds</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Solution Scoring */}
                      <div className="mb-6">
                        <h4 className="font-light text-black dark:text-white mb-3">Solution</h4>
                        <div className="space-y-4">
                          {scenario.scoringRubric.solution.map((criterion, index) => (
                            <div key={criterion.name} className="border border-gray-300 dark:border-gray-700 p-4">
                              <p className="font-light text-black dark:text-white mb-2">{criterion.name}</p>
                              <div className="flex items-center space-x-4">
                                <input
                                  aria-label={`Self score for solution criterion ${criterion.name}`}
                                  type="number"
                                  min="0"
                                  max={criterion.maxPoints}
                                  step="1"
                                  value={scores[`solution-${index}`] || 0}
                                  onChange={(e) => {
                                    const value = Math.min(criterion.maxPoints, Math.max(0, parseInt(e.target.value) || 0))
                                    setScores(prev => ({ ...prev, [`solution-${index}`]: value }))
                                  }}
                                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none bg-white dark:bg-black text-black dark:text-white"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">/ {criterion.maxPoints} points</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Career Competencies Scoring */}
                      <div className="mb-6">
                        <h4 className="font-light text-black dark:text-white mb-3">Career Competencies (0-6 points each)</h4>
                        <div className="space-y-4">
                          {scenario.centurySkills.map((skill, index) => (
                            <div key={index} className="border border-gray-300 dark:border-gray-700 p-4">
                              <p className="font-light text-black dark:text-white mb-2">{skill}</p>
                              <div className="flex items-center space-x-4">
                                <input
                                  aria-label={`Self score for career competency ${index + 1}: ${skill}`}
                                  type="number"
                                  min="0"
                                  max="6"
                                  step="1"
                                  value={scores[`skill-${index}`] || 0}
                                  onChange={(e) => {
                                    const value = Math.min(6, Math.max(0, parseInt(e.target.value) || 0));
                                    setScores(prev => ({ ...prev, [`skill-${index}`]: value }));
                                  }}
                                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none bg-white dark:bg-black text-black dark:text-white"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">/ 6 points</span>
                                <div className="flex-1 flex space-x-2 text-xs">
                                  <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-black dark:text-white">0-1: Little/No</span>
                                  <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-black dark:text-white">2-3: Below</span>
                                  <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-black dark:text-white">4: Meets</span>
                                  <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-black dark:text-white">5-6: Exceeds</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Overall Impression */}
                      <div className="mb-6">
                        <h4 className="font-light text-black dark:text-white mb-3">Overall Impression (0-{scenario.scoringRubric.overallImpression.maxPoints} points)</h4>
                        <div className="border border-gray-300 dark:border-gray-700 p-4">
                          <p className="font-light text-black dark:text-white mb-2">10. Overall impression and responses to the judge's questions</p>
                          <div className="flex items-center space-x-4">
                            <input
                              aria-label="Self score for overall impression"
                              type="number"
                              min="0"
                              max={scenario.scoringRubric.overallImpression.maxPoints}
                              step="1"
                              value={scores['overall'] || 0}
                              onChange={(e) => {
                                const value = Math.min(scenario.scoringRubric.overallImpression.maxPoints, Math.max(0, parseInt(e.target.value) || 0));
                                setScores(prev => ({ ...prev, overall: value }));
                              }}
                              className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none bg-white dark:bg-black text-black dark:text-white"
                            />
                            <span className="text-sm text-gray-600">/ {scenario.scoringRubric.overallImpression.maxPoints} points</span>
                            <div className="flex-1 flex space-x-2 text-xs">
                              <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-black dark:text-white">0-1: Little/No</span>
                              <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-black dark:text-white">2-3: Below</span>
                              <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-black dark:text-white">4: Meets</span>
                              <span className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-black dark:text-white">5-6: Exceeds</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Total Score */}
                      <div className="mb-6 p-4 border border-gray-300 dark:border-gray-700">
                        <h4 className="font-light text-black dark:text-white mb-2">Total Score</h4>
                        <p className="text-2xl font-light text-black dark:text-white">
                          {Object.values(scores).reduce((sum, score) => sum + score, 0)} / 100
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => {
                            setScores({})
                          }}
                          className="px-6 py-2 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white text-sm font-medium bg-white dark:bg-black transition-colors"
                        >
                          Clear Scores
                        </button>
                        <button
                          onClick={() => {
                            // Save scores logic here
                            alert(`Performance scored: ${Object.values(scores).reduce((sum, score) => sum + score, 0)}/100`);
                          }}
                          className="px-6 py-2 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white text-sm font-medium bg-white dark:bg-black transition-colors"
                        >
                          Save Score
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Floating Navigation Buttons */}
              <div className="fixed bottom-8 right-8 flex gap-4 z-40">
                {activeTab === 'scenario' && (
                  <button
                    onClick={() => {
                      setActiveTab('prep')
                      setPrepTimeRemaining(prepTime * 60)
                      setIsPrepTimerRunning(true)
                    }}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white font-medium bg-white dark:bg-black shadow-lg transition-all hover:shadow-xl"
                  >
                    Start Prep Time →
                  </button>
                )}
                {activeTab === 'prep' && (
                  <>
                    <button
                      onClick={() => setActiveTab('scenario')}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white font-medium bg-white dark:bg-black shadow-lg transition-all hover:shadow-xl"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('record')
                        setIsPrepTimerRunning(false)
                      }}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white font-medium bg-white dark:bg-black shadow-lg transition-all hover:shadow-xl"
                    >
                      Start Recording →
                    </button>
                  </>
                )}
                {activeTab === 'record' && (
                  <button
                    onClick={() => setActiveTab('prep')}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white text-black dark:text-white font-medium bg-white dark:bg-black shadow-lg transition-all hover:shadow-xl"
                  >
                    ← Back to Prep
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
