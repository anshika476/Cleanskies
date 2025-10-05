import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  age?: number;
  location?: string;
  accountType?: "individual" | "institution";
  healthConditions?: string;
  isSmoker?: boolean;
  hasAllergies?: boolean;
  respiratoryIssues?: boolean;
  heartConditions?: boolean;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  airQualityThresholds?: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
  };
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    // Optional: seed from localStorage for faster first paint
    const cached = localStorage.getItem("user");
    return cached ? (JSON.parse(cached) as User) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const setSession = (token: string | null, nextUser?: User | null) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (typeof nextUser !== "undefined") {
      if (nextUser) {
        localStorage.setItem("user", JSON.stringify(nextUser));
      } else {
        localStorage.removeItem("user");
      }
      setUser(nextUser ?? null);
    }
  };

  // Bootstrap session on mount
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // not logged in
        // Validate & fetch current user
        const me = await api.me();
        if (me) setSession(token, me);
      } catch (e) {
        // invalid token or /me failed: clear session
        setSession(null, null);
        console.error("Auth bootstrap failed:", e);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (
    usernameOrEmail: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // NOTE: Your backend login expects username.
      // If the user types an email, backend will fail unless you support email login.
      // We just pass through what was typed (your UI already shows a generic error).
      const res = await api.login(usernameOrEmail.trim(), password);
      if (!res?.access_token) return false;

      // Save token, then fetch user profile
      localStorage.setItem("token", res.access_token);
      let me: User | null = null;
      try {
        me = await api.me();
      } catch {
        // If /me is not available or fails, we still consider login OK,
        // but user will remain whatever was cached (possibly null).
      }

      setSession(res.access_token, me ?? user ?? null);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const created = await api.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      // Backend typically returns the created user; if not, we still attempt auto-login
      const ok = await login(username, password);
      return ok;
    } catch (err) {
      console.error("Registration error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setSession(null, null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    // Requires a valid token (api.updateMe uses it internally)
    try {
      const updated = await api.updateMe(updates as Record<string, unknown>);
      // Prefer server response; if none, merge locally
      const nextUser =
        updated && typeof updated === "object"
          ? (updated as User)
          : { ...(user as User), ...updates };

      setSession(localStorage.getItem("token"), nextUser);
    } catch (err) {
      console.error("Update profile failed:", err);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
