'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const INTENTS = ['general', 'family', 'travel', 'portrait', 'event']

export default function UploadPage() {
  const router = useRouter()
  const inputRef = useRef(null)
  
  const [files, setFiles] = useState([])
  const [intent, setIntent] = useState('general')
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => files.forEach(f => URL.revokeObjectURL(f.preview))
  }, [files])

  const processFiles = (newFiles) => {
    const validImages = newFiles.filter(f => f.type.startsWith('image/'))
    
    if (validImages.length !== newFiles.length) {
      setError('Some files were ignored. Only images are allowed.')
    } else {
      setError('')
    }

    const previewFiles = validImages.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID()
    }))

    setFiles(prev => [...prev, ...previewFiles])
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (idToRemove) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === idToRemove)
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.preview)
      return prev.filter(f => f.id !== idToRemove)
    })
  }

  const handleUpload = async () => {
    if (files.length === 0) return setError('Please add at least one photo.')
    
    setError('')
    setIsUploading(true)

    const formData = new FormData()
    files.forEach(f => formData.append('photos', f.file))
    formData.append('intent', intent)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload/`, {
        method: 'POST',
        body: formData,
      })
      
      if (!res.ok) throw new Error('Upload failed')
        
      const data = await res.json()
      if (data.job_id) {
        router.push(`/processing/${data.job_id}`)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      setError('Could not connect to the server. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12 md:py-24 text-[var(--foreground)]">
      <div className="mx-auto max-w-2xl">
        
        {/* Header */}
        <header className="mb-12">
          <Link 
            href="/" 
            className="group mb-8 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-[var(--muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
            Back to Home
          </Link>
          <h1 className="font-display text-4xl font-light tracking-tight md:text-5xl">
            Upload your photos
          </h1>
          <p className="mt-3 text-base text-[var(--muted)]">
            Our AI will score, select, and arrange them into a beautiful layout.
          </p>
        </header>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          tabIndex={0}
          role="button"
          aria-label="Upload photos by dragging and dropping or clicking to browse"
          className={`group cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 md:p-16 ${
            isDragging 
              ? 'border-[var(--accent)] bg-blue-50/50' 
              : 'border-[var(--border)] bg-gray-50/50 hover:border-[var(--muted)] hover:bg-gray-100/50'
          }`}
        >
          <input 
            ref={inputRef} 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileInput} 
          />
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[var(--border)] transition-transform group-hover:scale-110">
            <svg className="h-6 w-6 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="text-lg font-medium text-[var(--foreground)]">Drop photos here</p>
          <p className="mt-2 text-sm text-[var(--muted)]">or click to browse — JPG, PNG supported</p>
        </div>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                {files.length} Photo{files.length !== 1 && 's'} Selected
              </span>
              <button 
                onClick={() => setFiles([])}
                className="text-xs text-[var(--muted)] hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>
            
            <ul className="max-h-60 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {files.map((file) => (
                <li key={file.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-[var(--border)] bg-gray-50">
                      <Image 
                        src={file.preview} 
                        alt={file.file.name} 
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="truncate text-sm font-medium text-[var(--foreground)]">
                      {file.file.name}
                    </span>
                  </div>
                  <button 
                    onClick={() => removeFile(file.id)} 
                    className="shrink-0 rounded-full p-2 text-[var(--muted)] transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label={`Remove ${file.file.name}`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Intent Selector */}
        <div className="mt-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Album Style</p>
          <div className="flex flex-wrap gap-2">
            {INTENTS.map(i => (
              <button
                key={i}
                onClick={() => setIntent(i)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  intent === i 
                    ? 'bg-[var(--foreground)] text-white shadow-md' 
                    : 'border border-[var(--border)] bg-white text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100" role="alert">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading || files.length === 0}
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-4 text-base font-medium text-white shadow-lg shadow-[var(--accent)]/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        >
          {isUploading ? (
            <>
              <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading & Processing...
            </>
          ) : (
            'Generate Album →'
          )}
        </button>

      </div>
    </main>
  )
}