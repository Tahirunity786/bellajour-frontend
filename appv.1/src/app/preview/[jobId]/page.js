'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

// Helper functions for clean data formatting
const formatScore = (val) => Math.round((val || 0) * 100)
const formatLabel = (key) => key.replace('_score', '').replace(/_/g, ' ')

export default function PreviewPage() {
  const { jobId } = useParams()
  const router = useRouter()
  
  const [job, setJob] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!jobId) return

    const abortController = new AbortController()

    const fetchJobDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/status/${jobId}/`, {
          signal: abortController.signal
        })
        
        if (!res.ok) throw new Error('Failed to load preview details')
        
        const data = await res.json()
        setJob(data)
        
        if (data.photos?.length > 0) {
          // Sort photos by score descending just to be safe
          const sortedPhotos = [...data.photos].sort((a, b) => b.score - a.score)
          setSelectedPhoto(sortedPhotos[0])
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Could not load album. Please try again later.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobDetails()

    return () => abortController.abort()
  }, [jobId])

  if (isLoading) return <LoadingSkeleton />

  if (error || !job) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6 text-[var(--foreground)]">
        <p className="mb-4 text-red-500">{error || 'Album not found.'}</p>
        <button
          onClick={() => router.push('/upload')}
          className="rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Start over
        </button>
      </main>
    )
  }

  // Ensure photos are sorted by score
  const photos = [...(job.photos || [])].sort((a, b) => b.score - a.score)
  const bestPhotoId = photos[0]?.id

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12 md:py-20 text-[var(--foreground)]">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <header className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
              Album Preview
            </p>
            <h1 className="font-display text-4xl font-light tracking-tight md:text-5xl">
              Your photos, ranked
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {photos.length} photos scored by AI • Job #{jobId}
            </p>
          </div>
          <button
            onClick={() => router.push('/upload')}
            className="rounded-full border border-[var(--border)] bg-white px-6 py-2.5 text-sm font-medium text-[var(--muted)] shadow-sm transition-all hover:border-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            New album
          </button>
        </header>

        {/* Dynamic Featured Photo Section */}
        {selectedPhoto && (
          <section className="relative mb-16 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition-all">
            {selectedPhoto.id === bestPhotoId && (
              <div className="absolute left-4 top-4 z-10 rounded-full bg-[var(--gold)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                ★ Top Rated
              </div>
            )}
            
            <div className="flex flex-col md:flex-row">
              {/* Featured Image */}
              <div className="relative h-72 w-full bg-gray-50 md:h-[450px] md:w-3/5 lg:w-2/3">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}${selectedPhoto.image}`}
                  alt="Featured photo preview"
                  fill
                  className="object-cover"
                  unoptimized // Bypasses Next.js optimization for external raw server URLs
                />
              </div>
              
              {/* Score Breakdown */}
              <div className="flex w-full flex-col justify-center gap-8 p-8 md:w-2/5 lg:w-1/3">
                <div className="border-b border-[var(--border)] pb-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                    Overall Score
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-6xl font-light text-[var(--foreground)]">
                      {formatScore(selectedPhoto.score)}
                    </span>
                    <span className="text-sm text-[var(--muted)]">/ 100</span>
                  </div>
                </div>

                {selectedPhoto.score_details && (
                  <div className="space-y-5">
                    {Object.entries(selectedPhoto.score_details)
                      .filter(([k]) => k.endsWith('_score'))
                      .map(([key, val]) => (
                        <div key={key} className="group">
                          <div className="mb-2 flex justify-between text-xs font-medium">
                            <span className="capitalize text-[var(--muted)] transition-colors group-hover:text-[var(--foreground)]">
                              {formatLabel(key)}
                            </span>
                            <span className="text-[var(--accent)]">
                              {formatScore(val)}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div 
                              className="h-full rounded-full bg-[var(--accent)] transition-all duration-1000 ease-out" 
                              style={{ width: `${formatScore(val)}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Photo Grid */}
        <section>
          <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              All Photos — Ranked by Score
            </h2>
            <span className="text-xs text-[var(--muted)]">Select to inspect</span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {photos.map((photo, i) => {
              const isSelected = selectedPhoto?.id === photo.id
              const isHighCard = photo.score >= 0.8
              
              return (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`group relative flex flex-col overflow-hidden rounded-xl bg-white text-left transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ${
                    isSelected ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--background)]' : 'border border-[var(--border)] shadow-sm'
                  }`}
                  aria-label={`View details for photo ranked ${i + 1}`}
                >
                  <div className="relative h-40 w-full bg-gray-50 overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SERVER_URL}${photo.image}`}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                  <div className="flex items-center justify-between bg-white px-3 py-2.5">
                    <span className="text-xs font-medium text-[var(--muted)]">
                      #{i + 1}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        isHighCard
                          ? 'bg-blue-50 text-[var(--accent)]'
                          : 'bg-gray-100 text-[var(--muted)]'
                      }`}
                    >
                      {formatScore(photo.score)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

      </div>
    </main>
  )
}

// A sleek loading skeleton to prevent UI layout shift while fetching
function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12 md:py-20">
      <div className="mx-auto max-w-5xl animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-12 flex justify-between">
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
            <div className="h-10 w-64 rounded bg-gray-200"></div>
          </div>
          <div className="h-10 w-28 rounded-full bg-gray-200"></div>
        </div>
        
        {/* Featured Skeleton */}
        <div className="mb-16 flex h-96 w-full flex-col rounded-2xl bg-gray-100 md:flex-row">
          <div className="h-full w-full bg-gray-200 md:w-2/3"></div>
          <div className="w-full p-8 md:w-1/3">
            <div className="mb-8 h-16 w-32 rounded bg-gray-200"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 w-20 rounded bg-gray-200"></div>
                    <div className="h-3 w-8 rounded bg-gray-200"></div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-200"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-48 w-full rounded-xl bg-gray-200"></div>
          ))}
        </div>
      </div>
    </main>
  )
}