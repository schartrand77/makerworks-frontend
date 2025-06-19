import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

// Layout
import MainLayout from '@/components/layout/MainLayout'

// Pages
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import Browse from '@/pages/Browse'
import Cart from '@/pages/Cart'
import Favorites from '@/pages/Favorites'
import Account from '@/pages/Account'
import Upload from '@/pages/Upload'
import SignIn from '@/components/Auth/SignIn'
import SignUp from '@/components/Auth/SignUp'
import Admin from '@/pages/Admin'
import RequireAdmin from '@/components/Auth/RequireAdmin'


// Guards
import RequireAuth from '@/components/Auth/RequireAuth'

// Motion variant with dynamic direction
const pageVariants = {
  initial: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    position: 'absolute',
    width: '100%',
  }),
  animate: {
    x: 0,
    opacity: 1,
    position: 'relative',
    transition: { duration: 0.3 },
  },
  exit: (direction) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    position: 'absolute',
    width: '100%',
    transition: { duration: 0.3 },
  }),
}

export default function AnimatedRoutes({ location, direction }) {
  return (
    <AnimatePresence custom={direction} mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public pages — no auth, no navbar */}
        <Route
          path="/"
          element={
            <motion.div
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Landing />
            </motion.div>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <motion.div
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SignIn />
            </motion.div>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <motion.div
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SignUp />
            </motion.div>
          }
        />

        {/* Protected pages — require auth, wrapped in MainLayout */}
        <Route
          path="/dashboard"
          element={
            <motion.div
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <RequireAuth>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </RequireAuth>
            </motion.div>
          }
        />
        <Route
  path="/browse"
  element={
    <motion.div
      custom={direction}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <MainLayout>
        <Browse />
      </MainLayout>
    </motion.div>
  }
/>
        <Route
          path="/cart"
          element={
            <motion.div
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <RequireAuth>
                <MainLayout>
                  <Cart />
                </MainLayout>
              </RequireAuth>
            </motion.div>
          }
        />
        <Route
          path="/favorites"
          element={
            <motion.div
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <RequireAuth>
                <MainLayout>
                  <Favorites />
                </MainLayout>
              </RequireAuth>
            </motion.div>
          }
        />
        <Route
  path="/admin"
  element={
    <motion.div
      custom={direction}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <RequireAdmin>
        <MainLayout>
          <Admin />
        </MainLayout>
      </RequireAdmin>
    </motion.div>
  }
/>
        <Route
          path="/account"
          element={
            <motion.div
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
             <RequireAuth>
                <MainLayout>
                  <Account />
                </MainLayout>
              </RequireAuth>
            </motion.div>
          }
        />
        <Route path="/upload" element={
  <RequireAuth>
    <MainLayout>
      <Upload />
    </MainLayout>
  </RequireAuth>
} />
        <Route
          path="/upload"
          element={
            <motion.div
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <RequireAuth>
                <MainLayout>
                  <Upload />
                </MainLayout>
              </RequireAuth>
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}