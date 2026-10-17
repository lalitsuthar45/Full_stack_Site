import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getAuthToken,
  setAuthSession,
  clearAuthSession,
} from "./authStorage";

// =========================================================
// API URL
// =========================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pythonfastapi-production-f08a.up.railway.app";

// =========================================================
// TYPES
// =========================================================

export type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

type AuthContextType = {
  currentUser: User | null;
  authLoading: boolean;
  login: (
    user: User,
    accessToken: string,
    rememberMe?: boolean
  ) => void;
  logout: () => void;
};

// =========================================================
// CONTEXT
// =========================================================

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // =======================================================
  // VERIFY AUTHENTICATION ON APP LOAD / REFRESH
  // localStorage aur sessionStorage dono check karta hai
  // (Remember Me checked ho ya na ho, dono case handle hota
  // hai).
  // =======================================================

  useEffect(() => {
    const verifyAuthentication = async () => {
      const token = getAuthToken();

      if (!token) {
        clearAuthSession();
        setCurrentUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          clearAuthSession();
          setCurrentUser(null);
          setAuthLoading(false);
          return;
        }

        const data = await response.json();

        if (!data || !data.user || !data.user.email) {
          clearAuthSession();
          setCurrentUser(null);
          setAuthLoading(false);
          return;
        }

        setCurrentUser(data.user);

        // Jis storage mein session hai wahi update kar dein
        // (rememberMe preserve karne ke liye).
        const remembered = !!localStorage.getItem("access_token");

        setAuthSession(token, data.user, remembered);
      } catch (error) {
        console.error(
          "Authentication verification failed:",
          error
        );

        clearAuthSession();
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuthentication();
  }, []);

  // =======================================================
  // LOGIN - updates state IMMEDIATELY (no refresh needed)
  // rememberMe: true  -> localStorage (persists)
  // rememberMe: false -> sessionStorage (browser band hote
  // hi session khatam)
  // =======================================================

  const login = (
    user: User,
    accessToken: string,
    rememberMe: boolean = true
  ) => {
    setAuthSession(accessToken, user, rememberMe);
    setCurrentUser(user);
  };

  // =======================================================
  // LOGOUT
  // =======================================================

  const logout = () => {
    clearAuthSession();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, authLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================================================
// HOOK
// =========================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}