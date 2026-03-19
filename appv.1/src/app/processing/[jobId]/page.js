'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const STAGES = ['pending', 'processing', 'completed']

export default function ProcessingPage() {
  const router = useRouter()
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/status/${jobId}/`)
        const data = await res.json()
        setJob(data)
        if (data.status === 'completed') {
          setTimeout(() => router.push(`/preview/${jobId}`), 1500)
        } else if (data.status === 'failed') {
          setError('Processing failed. Please try again.')
        }
      } catch {
        setError('Could not reach the server.')
      }
    }

    poll()
    const interval = setInterval(poll, 2000)
    return () => clearInterval(interval)
  }, [jobId])

  const stageIndex = job ? STAGES.indexOf(job.status) : 0
  const progress = job?.status === 'completed' ? 100 : job?.status === 'processing' ? 60 : 20

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-md w-full text-center">

        {/* Animated circle */}
        <div className="relative w-28 h-28 mx-auto mb-12">
          <div
            className="absolute inset-0 rounded-full border-2 animate-spin"
            style={{ borderColor: `var(--accent) transparent transparent transparent`, animationDuration: '1.5s' }}
          />
          <div className="absolute inset-3 rounded-full flex items-center justify-center" style={{ background: 'var(--surface)' }}>
            <span className="font-display text-2xl text-cream">AI</span>
          </div>
        </div>

        <h1 className="font-display text-4xl font-light text-cream mb-3">
          {job?.status === 'completed' ? 'Album ready!' : 'Creating your album'}
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
          {job?.status === 'completed'
            ? 'Redirecting to your preview...'
            : job?.status === 'processing'
            ? 'Scoring and arranging your photos...'
            : 'Starting up the engines...'}
        </p>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full mb-6 overflow-hidden" style={{ background: 'var(--surface)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: 'var(--accent)' }}
          />
        </div>

        {/* Stages */}
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          {['Uploading', 'Scoring', 'Done'].map((label, i) => (
            <span key={label} style={{ color: i <= stageIndex ? 'var(--accent)' : 'var(--muted)' }}>
              {label}
            </span>
          ))}
        </div>

        {/* Job ID */}
        <p className="mt-10 text-xs" style={{ color: 'var(--border)' }}>Job #{jobId}</p>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
    </main>
  )
}