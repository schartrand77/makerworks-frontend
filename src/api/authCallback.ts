// src/api/authCallback.ts
import axios from "./axios";
import { useAuthStore } from "@/store/useAuthStore";

export async function handleAuthCallback(code: string): Promise<void> {
  if (!code) throw new Error("No authorization code provided");

  try {
    const redirect_uri = import.meta.env.VITE_AUTHENTIK_REDIRECT_URI;

    const res = await axios.post("/auth/token", { code, redirect_uri });
    const { token, user } = res.data;

    if (!token || !user) {
      throw new Error("Invalid response from /auth/token");
    }

    const authStore = useAuthStore.getState();
    authStore.setUser(user);
    authStore.setToken(token);

    console.debug("[AuthCallback] Token and user stored.");
  } catch (err) {
    console.error("[AuthCallback] Failed to handle auth callback:", err);
    throw err;
  }
}
