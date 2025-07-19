import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

export default function PageNotFound({ to = "/" }: { to?: string }) {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800">
      <Helmet>
        <title>404 – Page Not Found</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="backdrop-blur-md bg-white/30 dark:bg-zinc-800/30 rounded-3xl shadow-xl p-10 max-w-md"
      >
        <h1 className="text-6xl font-extrabold text-red-500 drop-shadow-sm">
          404 🚧
        </h1>

        <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
          Oops! The page you are looking for does not exist or has been moved.
        </p>

        <Link
          to={to}
          aria-label="Go to Home"
          className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform"
        >
          ⬅ Go Home
        </Link>
      </motion.div>
    </main>
  );
}
