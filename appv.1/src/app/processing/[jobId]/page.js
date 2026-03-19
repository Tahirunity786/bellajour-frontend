'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const STAGES = ['pending', 'processing', 'completed']

export default function ProcessingPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params?.jobId

  const [status, setStatus] = useState('pending')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!jobId) return

    let isSubscribed = true
    let pollInterval

    const checkStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/status/${jobId}/`)
        
        if (!res.ok) throw new Error('Network response was not ok')
        
        const data = await res.json()

        if (!isSubscribed) return

        setStatus(data.status)
        setError('') // Clear any previous network blip errors

        if (data.status === 'completed') {
          clearInterval(pollInterval)
          setTimeout(() => {
            if (isSubscribed) router.push(`/preview/${jobId}`)
          }, 1500)
        } else if (data.status === 'failed') {
          clearInterval(pollInterval)
          setError('Processing failed. Please try again.')
        }
      } catch (err) {
        if (isSubscribed) {
          setError('Connection lost. Retrying...')
        }
      }
    }

    // Initial check
    checkStatus() 
    
    // Start polling
    pollInterval = setInterval(checkStatus, 2000)

    // Cleanup on unmount
    return () => {
      isSubscribed = false
      clearInterval(pollInterval)
    }
  }, [jobId, router])

  const stageIndex = STAGES.indexOf(status) !== -1 ? STAGES.indexOf(status) : 0
  const progress = status === 'completed' ? 100 : status === 'processing' ? 60 : 20

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-md text-center">

        {/* Animated Loading Circle */}
        <div className="relative mx-auto mb-12 flex h-28 w-28 items-center justify-center">
          <div 
            className="absolute inset-0 animate-[spin_2s_linear_infinite] rounded-full border-4 border-gray-100 border-t-[var(--accent)]" 
          />
          <div className="absolute inset-2 flex items-center justify-center rounded-full bg-gray-50 shadow-inner ring-1 ring-gray-100/50">
            <span className="font-display text-2xl tracking-widest text-[var(--foreground)]">
              AI
            </span>
          </div>
        </div>

        {/* Status Text */}
        <h1 className="mb-3 font-display text-4xl font-light tracking-tight text-[var(--foreground)] md:text-5xl">
          {status === 'completed' ? 'Album ready!' : 'Creating your album'}
        </h1>
        <p className="mb-10 text-base text-[var(--muted)]">
          {status === 'completed'
            ? 'Redirecting to your preview...'
            : status === 'processing'
            ? 'Scoring, editing, and arranging your photos...'
            : 'Starting up the engines...'}
        </p>

        {/* Progress Bar */}
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-1000 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stage Indicators */}
        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {['Uploading', 'Processing', 'Done'].map((label, i) => (
            <span 
              key={label} 
              className={`transition-colors duration-500 ${
                i <= stageIndex ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
              }`}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Job ID & Errors */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="text-xs tracking-widest text-[var(--muted)]/60 uppercase">
            Job #{jobId}
          </p>
          
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 border border-red-100 animate-pulse">
              {error}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}