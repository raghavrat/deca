'use client'

import { useAuth } from '../context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Target, Clock, TrendingUp, User as UserIcon, Save, Download, Trash2 } from 'lucide-react'

interface QuestionStats {
  totalQuestions: number
  byCategory: {
    [key: string]: number
  }
  lastAttempt?: string
  streak?: number
}

export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<QuestionStats>({
    totalQuestions: 0,
    byCategory: {}
  })
  const [name, setName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [privacyError, setPrivacyError] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [leaderboardVisible, setLeaderboardVisible] = useState(false)
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        // Load stats from localStorage
        const savedStats = localStorage.getItem(`questionStats_${user.uid}`)
        if (savedStats) {
          setStats(JSON.parse(savedStats))
        }

        try {
          const response = await fetch('/api/account/profile', { cache: 'no-store' })
          if (!response.ok) throw new Error('Profile request failed')
          const profile = await response.json()
          setName(typeof profile.name === 'string' ? profile.name : '')
          setLeaderboardVisible(profile.leaderboardVisible === true)
        } catch {
          setPrivacyError('We could not load your account preferences. Please refresh and try again.')
        }
      }
      fetchUserData()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500 dark:text-neutral-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const normalizedName = name.trim()
    if (!normalizedName || normalizedName.length > 80) {
      setFeedback('Display name must be between 1 and 80 characters.')
      return
    }

    try {
      const response = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: normalizedName }),
      })
      if (!response.ok) throw new Error('Profile update failed')
      setName(normalizedName)
      setFeedback('Name updated successfully!')
      setIsEditingName(false)
      setTimeout(() => setFeedback(''), 3000)
    } catch (error) {
      console.error('Error updating name:', error)
      setFeedback('Failed to update name.')
    }
  }

  const handleExport = async () => {
    setPrivacyError('')
    setIsExporting(true)
    try {
      const response = await fetch('/api/account/data')
      if (!response.ok) throw new Error('Export failed')
      const data = await response.json()
      const downloadUrl = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
      const downloadLink = document.createElement('a')
      downloadLink.href = downloadUrl
      downloadLink.download = `deca-pal-data-${new Date().toISOString().slice(0, 10)}.json`
      downloadLink.click()
      URL.revokeObjectURL(downloadUrl)
    } catch {
      setPrivacyError('We could not export your data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') return
    setPrivacyError('')
    setIsDeleting(true)
    try {
      const response = await fetch('/api/account/data', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: deleteConfirmation }),
      })
      if (!response.ok) throw new Error('Deletion failed')
      localStorage.removeItem(`questionStats_${user.uid}`)
      try {
        await logout()
      } catch {
        window.location.assign('/')
      }
    } catch {
      setPrivacyError('We could not delete your account. Please try again or contact privacy@decapal.org.')
      setIsDeleting(false)
    }
  }

  const handleLeaderboardVisibility = async (visible: boolean) => {
    setPrivacyError('')
    setIsSavingPrivacy(true)
    try {
      const response = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaderboardVisible: visible }),
      })
      if (!response.ok) throw new Error('Preference update failed')
      setLeaderboardVisible(visible)
    } catch {
      setPrivacyError('We could not update your leaderboard preference. Please try again.')
    } finally {
      setIsSavingPrivacy(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-6 mb-6">
          <h1 className="text-4xl font-light text-black dark:text-white mb-2">Account Dashboard</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{user.email}</p>
        </div>

        {user.provider === 'clerk' && (
          <div className="mb-6 flex items-center justify-between border-b border-neutral-300 p-6 dark:border-neutral-700">
            <div>
              <h2 className="text-xl font-light text-black dark:text-white">Plan</h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Manage your subscription and billing interval.</p>
            </div>
            <Link href="/pricing" className="btn-ghost">Manage plan</Link>
          </div>
        )}

        {/* Name Section */}
        <div className="p-6 mb-6 border-b border-neutral-300 dark:border-neutral-700">
          <h2 className="text-xl font-light text-black dark:text-white mb-4">Display Name</h2>
          {!isEditingName ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserIcon className="h-6 w-6 text-neutral-500 dark:text-neutral-400 mr-3" />
                <span className="text-lg text-black dark:text-white">{name || 'No name set'}</span>
              </div>
              <button 
                onClick={() => setIsEditingName(true)} 
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Edit
              </button>
            </div>
          ) : (
            <form onSubmit={handleNameChange}>
              <div className="flex items-center">
                <input 
                  id="display-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  required
                  autoComplete="name"
                  className="input-minimal"
                  placeholder="Enter your display name"
                  aria-label="Display name"
                />
                <button type="submit" aria-label="Save display name" className="ml-3 px-4 py-2 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors duration-200">
                  <Save className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => setIsEditingName(false)} className="ml-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200">
                  Cancel
                </button>
              </div>
            </form>
          )}
          {feedback && <p role="status" className="text-sm text-green-700 dark:text-green-400 mt-2">{feedback}</p>}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-6 border border-neutral-300 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3">
                <Target className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
            <h3 className="text-2xl font-light text-black dark:text-white">{stats.totalQuestions}</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Total Questions Attempted</p>
          </div>

          <div className="p-6 border border-neutral-300 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3">
                <TrendingUp className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
            <h3 className="text-2xl font-light text-black dark:text-white">{stats.streak || 0}</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Day Streak</p>
          </div>

          <div className="p-6 border border-neutral-300 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3">
                <Clock className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
            <h3 className="text-lg font-light text-black dark:text-white">
              {stats.lastAttempt ? new Date(stats.lastAttempt).toLocaleDateString() : 'No attempts yet'}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Last Activity</p>
          </div>
          </div>

        <section aria-labelledby="privacy-controls-heading" className="mt-10 border-t border-neutral-300 p-6 dark:border-neutral-700">
          <h2 id="privacy-controls-heading" className="mb-2 text-xl font-light text-black dark:text-white">Your data</h2>
          <p className="mb-6 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            Download a copy of your server-stored information, or permanently delete your account, profile, and roleplay history.
          </p>

          {privacyError && <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-400">{privacyError}</p>}

          <div className="mb-6 flex items-start gap-3">
            <input
              id="leaderboard-visible"
              type="checkbox"
              checked={leaderboardVisible}
              disabled={isSavingPrivacy}
              onChange={(event) => handleLeaderboardVisibility(event.target.checked)}
              className="mt-1 h-5 w-5"
            />
            <label htmlFor="leaderboard-visible" className="text-sm leading-6 text-neutral-700 dark:text-neutral-300">
              Show my display name and problems-completed total on the student leaderboard. This is off by default.
            </label>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="mb-8 inline-flex min-h-11 items-center border border-neutral-400 px-4 py-2 text-sm disabled:opacity-50 dark:border-neutral-600"
          >
            <Download aria-hidden="true" className="mr-2 h-4 w-4" />
            {isExporting ? 'Preparing download…' : 'Download my data'}
          </button>

          <div className="border border-red-300 p-5 dark:border-red-900">
            <h3 className="mb-2 text-lg font-medium text-red-800 dark:text-red-300">Delete account permanently</h3>
            <p className="mb-4 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
              This cannot be undone. Type <strong>DELETE</strong> to confirm.
            </p>
            <label htmlFor="delete-confirmation" className="mb-2 block text-sm font-medium">Confirmation</label>
            <input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(event) => setDeleteConfirmation(event.target.value)}
              autoComplete="off"
              className="input-minimal mb-4 max-w-sm"
            />
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== 'DELETE' || isDeleting}
              className="inline-flex min-h-11 items-center border border-red-700 px-4 py-2 text-sm font-medium text-red-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-300"
            >
              <Trash2 aria-hidden="true" className="mr-2 h-4 w-4" />
              {isDeleting ? 'Deleting…' : 'Delete my account and data'}
            </button>
          </div>
        </section>

      </div>
    </div>
  )
}
