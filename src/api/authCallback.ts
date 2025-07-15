// src/api/authCallback.ts
import axios from "./axios";
import { useAuthStore } from "@/store/useAuthStore";

export async function handleAuthCallback(code: string): Promise<void> {
  const res = await axios.post("/auth/token", { code });
  const { token, user } = res.data;

  useAuthStore.getState().setUser(user);
  useAuthStore.getState().setToken(token);

  localStorage.setItem("token", token);
}
