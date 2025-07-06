export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Oops! The page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="mt-6 inline-block px-6 py-2 bg-primary text-white rounded shadow hover:bg-primary/90"
      >
        Go Home
      </a>
    </div>
  )
}