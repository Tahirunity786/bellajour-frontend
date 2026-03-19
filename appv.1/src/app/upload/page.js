'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const INTENTS = ['general', 'family', 'travel', 'portrait', 'event']

export default function UploadPage() {
  const router = useRouter()
  const inputRef = useRef()
  const [files, setFiles] = useState([])
  const [intent, setIntent] = useState('general')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...dropped])
  }

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...selected])
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return setError('Please add at least one photo.')
    setError('')
    setUploading(true)

    const formData = new FormData()
    files.forEach(f => formData.append('photos', f))
    formData.append('intent', intent)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload/`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.job_id) {
        router.push(`/processing/${data.job_id}`)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Could not connect to the server.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen px-6 py-12" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <a href="/" className="text-xs tracking-widest uppercase mb-6 block" style={{ color: 'var(--muted)' }}>← BELLAJOUR</a>
          <h1 className="font-display text-5xl font-light text-cream">Upload your photos</h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>Our AI will score and arrange them into a beautiful album.</p>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current.click()}
          className="rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition-all"
          style={{
            borderColor: dragging ? 'var(--accent)' : 'var(--border)',
            background: dragging ? 'var(--accent-soft)' : 'var(--surface)',
          }}
        >
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
          <div className="text-4xl mb-4">📷</div>
          <p className="text-cream font-light">Drop photos here</p>
          <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>or click to browse — JPG, PNG supported</p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-6 space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'var(--surface)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm text-cream truncate max-w-xs">{file.name}</span>
                </div>
                <button onClick={() => removeFile(i)} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--muted)' }}>✕</button>
              </div>
            ))}
            <p className="text-xs pt-1" style={{ color: 'var(--muted)' }}>{files.length} photo{files.length > 1 ? 's' : ''} selected</p>
          </div>
        )}

        {/* Intent selector */}
        <div className="mt-8">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>Album Style</p>
          <div className="flex flex-wrap gap-2">
            {INTENTS.map(i => (
              <button
                key={i}
                onClick={() => setIntent(i)}
                className="px-4 py-2 rounded-full text-sm capitalize transition-all"
                style={{
                  background: intent === i ? 'var(--accent)' : 'var(--surface)',
                  color: intent === i ? '#fff' : 'var(--muted)',
                  border: `1px solid ${intent === i ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="mt-10 w-full py-4 rounded-2xl text-white font-medium transition-all text-base disabled:opacity-40"
          style={{ background: 'var(--accent)' }}
        >
          {uploading ? 'Uploading...' : `Generate Album →`}
        </button>
      </div>
    </main>
  )
}