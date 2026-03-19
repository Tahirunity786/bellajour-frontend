'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function PreviewPage() {
  const { jobId } = useParams()
  const router = useRouter()
  const [job, setJob] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/status/${jobId}/`)
      .then(r => r.json())
      .then(data => {
        setJob(data)
        if (data.photos?.length > 0) setSelected(data.photos[0])
      })
  }, [jobId])

  if (!job) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <p style={{ color: 'var(--muted)' }}>Loading preview...</p>
    </main>
  )

  const photos = job.photos || []
  const best = photos[0]

  return (
    <main className="min-h-screen px-6 py-12" style={{ background: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>Album Preview</p>
            <h1 className="font-display text-5xl font-light text-cream">Your photos, ranked</h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>{photos.length} photos scored by AI • Job #{jobId}</p>
          </div>
          <button
            onClick={() => router.push('/upload')}
            className="text-sm px-5 py-2 rounded-full border transition-all hover:border-accent"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            New album
          </button>
        </div>

        {/* Best photo */}
        {best && (
          <div className="rounded-2xl overflow-hidden mb-10 relative" style={{ background: 'var(--surface)' }}>
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--gold)', color: '#000' }}>
              ★ Best photo
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 h-72 md:h-96 overflow-hidden">
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}${best.image}`}
                  alt="Best photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/3 p-8 flex flex-col justify-center gap-6">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>Overall Score</p>
                  <p className="font-display text-6xl font-light text-cream">{Math.round(best.score * 100)}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>out of 100</p>
                </div>
                {best.score_details && (
                  <div className="space-y-3">
                    {Object.entries(best.score_details)
                      .filter(([k]) => k.endsWith('_score'))
                      .map(([key, val]) => (
                        <div key={key}>
                          <div className="flex justify-between text-xs mb-1">
                            <span style={{ color: 'var(--muted)' }}>{key.replace('_score', '').replace('_', ' ')}</span>
                            <span style={{ color: 'var(--accent)' }}>{Math.round(val * 100)}</span>
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                            <div className="h-full rounded-full" style={{ width: `${val * 100}%`, background: 'var(--accent)' }} />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Photo grid */}
        <p className="text-xs tracking-widest uppercase mb-6" style={{ color: 'var(--muted)' }}>All photos — ranked by score</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              onClick={() => setSelected(photo)}
              className="rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 relative"
              style={{
                background: 'var(--surface)',
                outline: selected?.id === photo.id ? '2px solid var(--accent)' : 'none'
              }}
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}${photo.image}`}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--muted)' }}>#{i + 1}</span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: photo.score > 0.6 ? 'rgba(58,134,255,0.15)' : 'rgba(255,255,255,0.05)',
                    color: photo.score > 0.6 ? 'var(--accent)' : 'var(--muted)'
                  }}
                >
                  {Math.round(photo.score * 100)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected photo details */}
        {selected && selected.score_details && (
          <div className="mt-10 rounded-2xl p-8" style={{ background: 'var(--surface)' }}>
            <p className="text-xs tracking-widest uppercase mb-6" style={{ color: 'var(--muted)' }}>Score breakdown</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(selected.score_details)
                .filter(([k]) => k.endsWith('_score'))
                .map(([key, val]) => (
                  <div key={key} className="text-center">
                    <p className="font-display text-3xl font-light text-cream">{Math.round(val * 100)}</p>
                    <p className="text-xs mt-1 capitalize" style={{ color: 'var(--muted)' }}>{key.replace('_score', '').replace('_', ' ')}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}