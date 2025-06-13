// App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PWAInstallButton from './components/PWAInstall'
import SignUp from './components/Auth/SignUp'
import SignIn from './components/Auth/SignIn'
import SignOut from './components/Auth/SignOut'
import RequireAuth from './components/Auth/RequireAuth'
import RequireAdmin from './components/Auth/RequireAdmin'
import UploadForm from './components/Upload/UploadForm'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Browse from './pages/Browse'
import Estimate from './pages/Estimate'
import Admin from './pages/Admin'
import Cart from './pages/Cart'
import Settings from './pages/Settings'
import Navbar from './components/Navbar'
import Checkout from './pages/Checkout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/browse" element={<Browse />} />

        {/* Protected */}
        <Route
          path="/upload"
          element={
            <RequireAuth>
              <UploadForm />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/estimate"
          element={
            <RequireAuth>
              <Estimate />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            </RequireAuth>
          }
        />
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route
  path="/settings"
  element={
    <RequireAuth>
      <Settings />
    </RequireAuth>
  }
        
        
      </Routes>

      {/* Global PWA Install Prompt */}
      <PWAInstallButton />
    </BrowserRouter>
  )
}

export default App