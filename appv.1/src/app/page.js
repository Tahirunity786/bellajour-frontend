import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Footer />
    </main>
  )
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-24 items-center justify-between px-6 md:px-12">
        <Link 
          href="/" 
          className="font-display text-2xl tracking-[0.2em] text-[var(--foreground)] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label="Bellajour Home"
        >
          BELLAJOUR
        </Link>
        <Link
          href="/upload"
          className="rounded-full border border-[var(--border)] px-6 py-2.5 text-sm font-medium text-[var(--muted)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Create Album
        </Link>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center md:py-32">
      <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[var(--gold)]">
        AI-Powered Photo Albums
      </p>
      
      <h1 className="mb-8 max-w-4xl font-display text-5xl font-light leading-[1.1] text-[var(--foreground)] sm:text-6xl md:text-8xl">
        Your memories,<br />
        <em className="text-[var(--foreground)] font-medium">beautifully printed.</em>
      </h1>
      
      <p className="mb-12 max-w-xl text-lg text-[var(--muted)] sm:text-xl">
        Upload your photos. Our AI selects, arranges, and designs a premium printed album — in minutes.
      </p>
      
      <Link
        href="/upload"
        className="group inline-flex items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-10 py-4 text-base font-medium text-white transition-all hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(37,99,235,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        Create my album
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { step: '01', title: 'Upload', desc: 'Drop your photos — as many as you want.' },
    { step: '02', title: 'AI creates', desc: 'Our engine scores, selects and designs your album.' },
    { step: '03', title: 'Receive', desc: 'A premium printed album delivered to your door.' },
  ]

  return (
    <section className="border-t border-[var(--border)] px-6 py-24 md:px-12 bg-[var(--background)]">
      <h2 className="mb-20 text-center text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
        How it works
      </h2>
      
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
        {steps.map(({ step, title, desc }) => (
          <article key={step} className="flex flex-col gap-4 text-center md:text-left">
            <span className="font-display text-5xl font-light text-[var(--border)]">
              {step}
            </span>
            <h3 className="font-display text-2xl text-[var(--foreground)]">
              {title}
            </h3>
            <p className="leading-relaxed text-[var(--muted)]">
              {desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--muted)] bg-[var(--background)]">
      <p>© {new Date().getFullYear()} Bellajour — All rights reserved</p>
    </footer>
  )
}