'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col" >

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <span className="font-display text-2xl tracking-widest text-cream">BELLAJOUR</span>
        <button
          onClick={() => router.push('/upload')}
          className="text-sm px-5 py-2 rounded-full border transition-all hover:bg-accent hover:border-accent hover:text-white"
          style={{ borderColor: 'var(--muted)', color: 'var(--muted)' }}
        >
          Create Album
        </button>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
        <p className="text-xs tracking-[0.4em] mb-6 uppercase" style={{ color: 'var(--gold)' }}>
          AI-Powered Photo Albums
        </p>
        <h1 className="font-display text-6xl md:text-8xl font-light leading-tight text-cream mb-6 max-w-4xl">
          Your memories,<br />
          <em>beautifully printed.</em>
        </h1>
        <p className="text-lg max-w-xl mb-12" style={{ color: 'var(--muted)' }}>
          Upload your photos. Our AI selects, arranges, and designs a premium printed album — in minutes.
        </p>
        <button
          onClick={() => router.push('/upload')}
          className="px-10 py-4 rounded-full text-white font-medium transition-all hover:scale-105 hover:shadow-lg text-base"
          style={{ background: 'var(--accent)', boxShadow: '0 0 40px rgba(58,134,255,0.2)' }}
        >
          Create my album →
        </button>
      </section>

      {/* How it works */}
      <section className="px-10 py-20 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-center text-xs tracking-[0.4em] uppercase mb-16" style={{ color: 'var(--muted)' }}>
          How it works
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Upload', desc: 'Drop your photos — as many as you want.' },
            { step: '02', title: 'AI creates', desc: 'Our engine scores, selects and designs your album.' },
            { step: '03', title: 'Receive', desc: 'A premium printed album delivered to your door.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col gap-4">
              <span className="font-display text-5xl font-light" style={{ color: 'var(--border)' }}>{step}</span>
              <h3 className="font-display text-2xl text-cream">{title}</h3>
              <p style={{ color: 'var(--muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-xs border-t" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
        © 2026 Bellajour — All rights reserved
      </footer>
    </main>
  )
}