'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { ArrowLeft, RefreshCw, Trophy, ClipboardList, ChevronUp, ChevronDown, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { DECAScenario } from '../../types'
import { getInstructionalAreasByCategory, InstructionalArea } from '../../utils/instructionalAreas'
import { getEventById } from '../../data/decaEvents'

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

  const displayName = categoryDisplayNames[category] || category
  const selectedEvent = eventId ? getEventById(eventId) : null

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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/roleplay"
              className="flex items-center text-gray-600 hover:text-[#0066cc] transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Categories
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{displayName} Roleplay</h1>
              {selectedEvent && (
                <p className="text-sm text-gray-600 mt-1 flex items-center">
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
              <p className="text-xs text-gray-500 mt-1">Please use responsibly - limited to 1 per 5 minutes</p>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-[15px] mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-[15px] shadow-md p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#0066cc]" />
            <p className="text-gray-600">Generating your roleplay scenario...</p>
          </div>
        )}


        {/* Instructional Area Selection */}
        {showInstructionalAreaSelection && !loading && (
          <div className="bg-white rounded-[15px] shadow-lg p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0066cc]/10 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-[#0066cc]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Select an Instructional Area</h2>
              <p className="text-gray-600">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructional Area
                </label>
                
                {/* Selected Area Display */}
                {selectedInstructionalArea && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {selectedInstructionalArea === 'RANDOM' ? '🎲 Random Selection' : selectedInstructionalArea}
                        </p>
                        {selectedInstructionalArea !== 'RANDOM' && (
                          <p className="text-xs text-blue-700 mt-1">
                            {instructionalAreas.find(a => a.name === selectedInstructionalArea)?.piCount || 0} performance indicators
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedInstructionalArea('')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
                    className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-[15px] shadow-md text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] flex justify-between items-center click-animation"
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
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or choose specific area</span>
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
                        className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold py-3 px-6 rounded-[15px] shadow-md text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066cc] flex justify-between items-center click-animation"
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
                <p className="text-xs text-gray-500 text-center mt-3">
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
            <div className="bg-white rounded-[15px] shadow-md p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{scenario.eventCode}</h2>
                <div className="space-y-1 text-gray-600">
                  <p><strong>CAREER CLUSTER:</strong> {scenario.careerCluster}</p>
                  <p><strong>CAREER PATHWAY:</strong> {scenario.careerPathway}</p>
                </div>
              </div>

              {/* Participant Instructions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">PARTICIPANT INSTRUCTIONS</h3>
                <div className="space-y-2">
                  {scenario.participantInstructions.map((instruction, index) => (
                    <p key={index} className="text-gray-700">• {instruction}</p>
                  ))}
                </div>
              </div>

              {/* 21st Century Skills */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">21st CENTURY SKILLS</h3>
                <div className="space-y-2">
                  {scenario.centurySkills.map((skill, index) => (
                    <p key={index} className="text-gray-700">• {skill}</p>
                  ))}
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">PERFORMANCE INDICATORS</h3>
                <div className="space-y-2">
                  {scenario.performanceIndicators.map((indicator, index) => (
                    <p key={index} className="text-gray-700">{index + 1}. {indicator}</p>
                  ))}
                </div>
              </div>

              {/* Event Situation */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">EVENT SITUATION</h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>{scenario.eventSituation.roleDescription}</p>
                  <p>{scenario.eventSituation.companyBackground}</p>
                  <p>{scenario.eventSituation.businessChallenge}</p>
                  <p>{scenario.eventSituation.taskDescription}</p>
                  <p>{scenario.eventSituation.presentationContext}</p>
                </div>
              </div>

              {/* Judge Instructions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">JUDGE'S INSTRUCTIONS</h3>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">JUDGE ROLE-PLAY CHARACTERIZATION</h4>
                  <p className="text-gray-700 leading-relaxed">{scenario.judgeInstructions.roleCharacterization}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">QUESTIONS TO ASK DURING ROLEPLAY</h4>
                  <div className="space-y-2">
                    {scenario.judgeInstructions.questionsToAsk.map((question, index) => (
                      <p key={index} className="text-gray-700">{index + 1}. {question}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">EVALUATION CRITERIA</h4>
                  <p className="text-gray-700 leading-relaxed">{scenario.judgeInstructions.evaluationCriteria}</p>
                </div>
              </div>

              {/* Scoring Rubric */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">JUDGE'S EVALUATION FORM</h3>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 mb-4">PERFORMANCE INDICATORS</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border-2 border-gray-400">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border-2 border-gray-400 p-3 text-left font-bold text-gray-800">Did the participant:</th>
                          <th className="border-2 border-gray-400 p-3 text-center font-bold text-red-700">Little/No Value<br /><span className="text-sm font-normal">0-4</span></th>
                          <th className="border-2 border-gray-400 p-3 text-center font-bold text-yellow-700">Below Expectations<br /><span className="text-sm font-normal">5-8</span></th>
                          <th className="border-2 border-gray-400 p-3 text-center font-bold text-blue-700">Meets Expectations<br /><span className="text-sm font-normal">9-11</span></th>
                          <th className="border-2 border-gray-400 p-3 text-center font-bold text-green-700">Exceeds Expectations<br /><span className="text-sm font-normal">12-14</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {scenario.scoringRubric.performanceIndicators.map((indicator, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border-2 border-gray-400 p-3 font-medium text-gray-800">{index + 1}. {indicator.name}</td>
                            <td className="border-2 border-gray-400 p-3 text-center bg-red-50 font-mono">0-1-2-3-4</td>
                            <td className="border-2 border-gray-400 p-3 text-center bg-yellow-50 font-mono">5-6-7-8</td>
                            <td className="border-2 border-gray-400 p-3 text-center bg-blue-50 font-mono">9-10-11</td>
                            <td className="border-2 border-gray-400 p-3 text-center bg-green-50 font-mono">12-13-14</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 mb-4">21st CENTURY SKILLS</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border-2 border-gray-400">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border-2 border-gray-400 p-3 text-left font-bold text-gray-800">Skill</th>
                          <th className="border-2 border-gray-400 p-3 text-center font-bold text-red-700">Little/No Value<br /><span className="text-sm font-normal">0-1</span></th>
                          <th className="border-2 border-gray-400 p-3 text-center font-bold text-yellow-700">Below Expectations<br /><span className="text-sm font-normal">2-3</span></th>
                          <th className="border-2 border-gray-400 p-3 text-center font-bold text-blue-700">Meets Expectations<br /><span className="text-sm font-normal">4</span></th>
                          <th className="border-2 border-gray-400 p-3 text-center font-bold text-green-700">Exceeds Expectations<br /><span className="text-sm font-normal">5-6</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {scenario.scoringRubric.centurySkills.map((skill, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border-2 border-gray-400 p-3 font-medium text-gray-800">{index + 6}. {skill.name}</td>
                            <td className="border-2 border-gray-400 p-3 text-center bg-red-50 font-mono">0-1</td>
                            <td className="border-2 border-gray-400 p-3 text-center bg-yellow-50 font-mono">2-3</td>
                            <td className="border-2 border-gray-400 p-3 text-center bg-blue-50 font-mono">4</td>
                            <td className="border-2 border-gray-400 p-3 text-center bg-green-50 font-mono">5-6</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100">
                          <td className="border-2 border-gray-400 p-3 font-medium text-gray-800">10. Overall impression and responses to the judge's questions</td>
                          <td className="border-2 border-gray-400 p-3 text-center bg-red-50 font-mono">0-1</td>
                          <td className="border-2 border-gray-400 p-3 text-center bg-yellow-50 font-mono">2-3</td>
                          <td className="border-2 border-gray-400 p-3 text-center bg-blue-50 font-mono">4</td>
                          <td className="border-2 border-gray-400 p-3 text-center bg-green-50 font-mono">5-6</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <p className="text-xl font-bold text-gray-800">TOTAL SCORE: _____ / 100</p>
                </div>
              </div>

              <div className="text-center">
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
                <div className="bg-white rounded-[15px] shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-800">Score Performance - {scenario.eventCode}</h3>
                      <button
                        onClick={() => setShowScoring(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Performance Indicators Scoring */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Performance Indicators (0-14 points each)</h4>
                      <div className="space-y-4">
                        {scenario.performanceIndicators.map((indicator, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <p className="font-medium text-gray-700 mb-2">{index + 1}. {indicator}</p>
                            <div className="flex space-x-4">
                              {[
                                { label: 'Little/No Value', range: '0-4', color: 'bg-red-100 text-red-800' },
                                { label: 'Below Expectations', range: '5-8', color: 'bg-yellow-100 text-yellow-800' },
                                { label: 'Meets Expectations', range: '9-11', color: 'bg-blue-100 text-blue-800' },
                                { label: 'Exceeds Expectations', range: '12-14', color: 'bg-green-100 text-green-800' }
                              ].map((level) => (
                                <label key={level.label} className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${level.color}`}>
                                  <input
                                    type="radio"
                                    name={`indicator-${index}`}
                                    value={level.range}
                                    onChange={() => {
                                      const midPoint = level.range === '0-4' ? 2 : level.range === '5-8' ? 6.5 : level.range === '9-11' ? 10 : 13;
                                      setScores(prev => ({ ...prev, [`indicator-${index}`]: midPoint }));
                                    }}
                                  />
                                  <span className="text-sm">
                                    {level.label}<br />
                                    <span className="font-mono">{level.range}</span>
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 21st Century Skills Scoring */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">21st Century Skills (0-6 points each)</h4>
                      <div className="space-y-4">
                        {scenario.centurySkills.map((skill, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <p className="font-medium text-gray-700 mb-2">{index + 6}. {skill}</p>
                            <div className="flex space-x-4">
                              {[
                                { label: 'Little/No Value', range: '0-1', color: 'bg-red-100 text-red-800' },
                                { label: 'Below Expectations', range: '2-3', color: 'bg-yellow-100 text-yellow-800' },
                                { label: 'Meets Expectations', range: '4', color: 'bg-blue-100 text-blue-800' },
                                { label: 'Exceeds Expectations', range: '5-6', color: 'bg-green-100 text-green-800' }
                              ].map((level) => (
                                <label key={level.label} className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${level.color}`}>
                                  <input
                                    type="radio"
                                    name={`skill-${index}`}
                                    value={level.range}
                                    onChange={() => {
                                      const midPoint = level.range === '0-1' ? 0.5 : level.range === '2-3' ? 2.5 : level.range === '4' ? 4 : 5.5;
                                      setScores(prev => ({ ...prev, [`skill-${index}`]: midPoint }));
                                    }}
                                  />
                                  <span className="text-sm">
                                    {level.label}<br />
                                    <span className="font-mono">{level.range}</span>
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Overall Impression */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Overall Impression (0-6 points)</h4>
                      <div className="border rounded-lg p-4">
                        <p className="font-medium text-gray-700 mb-2">10. Overall impression and responses to the judge's questions</p>
                        <div className="flex space-x-4">
                          {[
                            { label: 'Little/No Value', range: '0-1', color: 'bg-red-100 text-red-800' },
                            { label: 'Below Expectations', range: '2-3', color: 'bg-yellow-100 text-yellow-800' },
                            { label: 'Meets Expectations', range: '4', color: 'bg-blue-100 text-blue-800' },
                            { label: 'Exceeds Expectations', range: '5-6', color: 'bg-green-100 text-green-800' }
                          ].map((level) => (
                            <label key={level.label} className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${level.color}`}>
                              <input
                                type="radio"
                                name="overall"
                                value={level.range}
                                onChange={() => {
                                  const midPoint = level.range === '0-1' ? 0.5 : level.range === '2-3' ? 2.5 : level.range === '4' ? 4 : 5.5;
                                  setScores(prev => ({ ...prev, overall: midPoint }));
                                }}
                              />
                              <span className="text-sm">
                                {level.label}<br />
                                <span className="font-mono">{level.range}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Total Score */}
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Total Score</h4>
                      <p className="text-2xl font-bold text-gray-800">
                        {Object.values(scores).reduce((sum, score) => sum + score, 0).toFixed(1)} / 100
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowScoring(false)}
                        className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-[15px] transition-colors click-animation"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Save scores logic here
                          alert(`Performance scored: ${Object.values(scores).reduce((sum, score) => sum + score, 0).toFixed(1)}/100`);
                          setShowScoring(false);
                        }}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-[15px] transition-colors click-animation"
                      >
                        Save Score
                      </button>
                    </div>
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