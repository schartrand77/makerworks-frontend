// src/components/layout/MainLayout.jsx
import Navbar from '@/components/navigation/Navbar'

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen page-safe-area bg-neutral-950 text-white">
        {children}
      </main>
    </>
  )
}