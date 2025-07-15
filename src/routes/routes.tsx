// src/routes.tsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Browse from "@/pages/Browse";
import Estimate from "@/pages/Estimate";
import Upload from "@/pages/Upload";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import SignIn from "@/pages/SignIn";
import NotFound from "@/pages/NotFound";
import AuthCallbackPage from "@/pages/AuthCallbackPage"; // 👈 add this import

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/estimate" element={<Estimate />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} /> {/* 👈 add this route */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
