import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

export type Role = "user" | "admin";
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  token: string;
  balance: number;
};

const KEY = "sb-stocks-session";

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    window.localStorage.setItem(KEY, JSON.stringify(user));
    window.localStorage.setItem('sb_stocks_token', user.token);
  } else {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem('sb_stocks_token');
  }
  window.dispatchEvent(new Event("sb-auth-change"));
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  useEffect(() => {
    setUser(getSession());
    const on = () => setUser(getSession());
    window.addEventListener("sb-auth-change", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("sb-auth-change", on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return user;
}

export async function login(email: string, password: string): Promise<SessionUser> {
  try {
    const response = await axiosInstance.post('/users/login', { email, password });
    const data = response.data;
    const sessionUser: SessionUser = {
      id: data._id,
      email: data.email,
      name: data.username,
      role: data.role || data.usertype,
      token: data.token,
      balance: data.balance,
    };
    setSession(sessionUser);
    return sessionUser;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to log in");
  }
}

export async function register(username: string, email: string, password: string, role?: string): Promise<SessionUser> {
  try {
    const response = await axiosInstance.post('/users/register', { username, email, password, role });
    const data = response.data;
    const sessionUser: SessionUser = {
      id: data._id,
      email: data.email,
      name: data.username,
      role: data.role || data.usertype,
      token: data.token,
      balance: data.balance,
    };
    setSession(sessionUser);
    return sessionUser;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to register");
  }
}

