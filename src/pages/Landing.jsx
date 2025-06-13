// src/pages/Landing.jsx
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f8f9fb]/80 to-[#e5e7eb]/40 dark:from-[#1a1a1a]/70 dark:to-[#0d0d0d]/90 transition-colors duration-500">
      <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 shadow-xl rounded-2xl max-w-3xl w-full mx-auto p-8 md:p-12 text-center space-y-8 animate-fade-in-up">
        <img
          src="/assets/MWlogobanner.png"
          alt="MakerWorks Logo Banner"
          className="w-full max-h-40 object-contain mx-auto mb-6 drop-shadow-lg"
        />

        <h1 className="text-4xl md:text-5xl font-bold text-black/90 dark:text-white drop-shadow-sm">
          Welcome to MakerWorks
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          The ultimate platform for makers. Upload, preview, and order 3D prints with elegance.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-6">
          <Link
            to="/signup"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
          >
            Get Started
          </Link>
          <Link
            to="/signin"
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-black dark:text-white font-semibold rounded-xl border border-white/10 transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}