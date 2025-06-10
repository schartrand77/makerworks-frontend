import { useEffect, useState } from 'react'
import classNames from 'classnames'

export default function BackendStatusToggle() {
  const [connected, setConnected] = useState(null)

  useEffect(() => {
    fetch('/api/ping')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') setConnected(true)
        else setConnected(false)
      })
      .catch(() => setConnected(false))
  }, [])

  return (
    <div
      className={classNames(
        'w-14 h-8 rounded-full relative transition-all duration-500 glass border border-white/10',
        connected === true && 'bg-green-400/10',
        connected === false && 'bg-red-400/10'
      )}
    >
      <div
        className={classNames(
          'absolute top-1 left-1 w-6 h-6 rounded-full shadow-inner transition-all duration-500',
          connected === true
            ? 'bg-green-400 animate-ping-slow'
            : connected === false
            ? 'bg-red-400 animate-ping-slow'
            : 'bg-gray-300 animate-pulse'
        )}
        style={{
          transform: connected ? 'translateX(24px)' : 'translateX(0)',
        }}
      />
    </div>
  )
}