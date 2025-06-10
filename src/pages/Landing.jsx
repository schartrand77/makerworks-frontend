// pages/Landing.jsx

import GlassCard from '../components/GlassCard'
import { useEffect, useState } from 'react'

export default function Landing() {
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: 'url("/MWlogobanner.png")',
          backgroundAttachment: 'fixed',
        }}
      />
      


      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-white">
        <GlassCard className={`w-full max-w-xl text-center p-8 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">MakerWorks</h1>
          <p className="mt-4 text-lg text-gray-300">Upload. Preview. Estimate. Print. Repeat.</p>
          <button
            onClick={() => window.location.href = '/browse'}
            className="mt-6 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white backdrop-blur border border-white/20"
          >
            Enter App →
          </button>
        </GlassCard>
      </div>
    </div>
  )
}