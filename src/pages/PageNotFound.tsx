export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800">
      <h1 className="text-6xl font-extrabold text-red-500 drop-shadow-sm">
        404 🚧
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <a
        href="/"
        aria-label="Go to Home"
        className="mt-6 inline-block px-6 py-2 bg-primary text-white rounded-full shadow-md hover:bg-primary/90 hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
      >
        ⬅ Go Home
      </a>
    </div>
  )
}
