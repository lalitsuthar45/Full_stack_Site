import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleLogin,
  type CredentialResponse,
} from "@react-oauth/google";
import { Mail, Lock, Eye, EyeOff, Flame } from "lucide-react";

import { useAuth } from "./AuthContext";
import { useToast } from "./Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pythonfastapi-production-f08a.up.railway.app";

type UserData = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

// =========================================================
// ROTATING TAGLINES (hero panel personality)
// =========================================================

const TAGLINES = [
  "Wood-fired pizzas.",
  "Midnight biryani runs.",
  "Sunday family brunches.",
  "Chai that actually tastes like home.",
];

// =========================================================
// RATE LIMITING (client-side throttle on the login button)
// Max 5 attempts within a 60 second window, then the button
// disables with a countdown until the oldest attempt expires.
// =========================================================

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const ATTEMPTS_KEY = "login_attempts";

function getRecentAttempts(): number[] {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    const attempts: number[] = raw ? JSON.parse(raw) : [];
    const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
    return attempts.filter((timestamp) => timestamp > cutoff);
  } catch {
    return [];
  }
}

function recordAttempt() {
  const attempts = getRecentAttempts();
  attempts.push(Date.now());
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
}

function clearAttempts() {
  localStorage.removeItem(ATTEMPTS_KEY);
}

function Loginpage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  // =====================================================
  // RATE LIMIT COUNTDOWN
  // Har second check karta hai ki abhi bhi rate-limited hai
  // ya nahi, aur button disable/countdown update karta hai.
  // =====================================================

  useEffect(() => {
    const updateCooldown = () => {
      const attempts = getRecentAttempts();

      if (attempts.length < RATE_LIMIT_MAX) {
        setCooldownSeconds(0);
        return;
      }

      const oldest = Math.min(...attempts);
      const unlockAt = oldest + RATE_LIMIT_WINDOW_MS;
      const remaining = Math.max(
        0,
        Math.ceil((unlockAt - Date.now()) / 1000)
      );

      setCooldownSeconds(remaining);
    };

    updateCooldown();

    const interval = window.setInterval(updateCooldown, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const isRateLimited = cooldownSeconds > 0;

  // =====================================================
  // SAVE AUTHENTICATION
  // =====================================================

  const saveUser = (
    user: UserData,
    accessToken: string,
    _message: string
  ) => {
    login(user, accessToken, rememberMe);
    clearAttempts();
    // Direct login into website without blocking alert
    navigate("/home", { replace: true });
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ) => {
    if (isRateLimited) {
      toast.warning(
        `Too many login attempts. Please try again in ${cooldownSeconds}s.`
      );
      return;
    }

    if (!credentialResponse.credential) {
      toast.error("Google login failed");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Google login failed");
        return;
      }

      if (!data.access_token) {
        toast.error("Authentication token not received");
        return;
      }

      saveUser(
        data.user,
        data.access_token,
        data.message || "Google Login Successful"
      );
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // NORMAL LOGIN
  // =====================================================

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isRateLimited) {
      toast.warning(
        `Too many login attempts. Please try again in ${cooldownSeconds}s.`
      );
      return;
    }

    const cleanEmail = email.trim();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      toast.warning("Please fill all fields");
      return;
    }

    setLoading(true);
    recordAttempt();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Invalid email or password");
        return;
      }

      if (!data.access_token) {
        toast.error("Authentication token not received");
        return;
      }

      saveUser(
        data.user,
        data.access_token,
        data.message || "Login successful"
      );
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen flex items-stretch bg-[#FFF8F0]">
      <div className="w-full grid lg:grid-cols-[1fr_1.1fr]">

        {/* =================================================
            LEFT — ESPRESSO HERO PANEL
        ================================================= */}

        <div className="relative overflow-hidden bg-[#1F1410] text-[#FFF3E6] px-8 py-10 lg:py-0 flex flex-col justify-center lg:min-h-screen">

          {/* Drifting warm blobs */}
          <div className="pointer-events-none absolute -top-24 -left-16 w-72 h-72 rounded-full bg-orange-600/30 blur-3xl blob-a" />
          <div className="pointer-events-none absolute bottom-[-4rem] right-[-3rem] w-80 h-80 rounded-full bg-red-500/25 blur-3xl blob-b" />
          <div className="pointer-events-none absolute top-1/3 right-10 w-40 h-40 rounded-full bg-amber-400/20 blur-2xl blob-c" />

          <div className="relative z-10 max-w-md mx-auto lg:mx-0">

            <div className="flex items-center gap-3 mb-10 fade-in-up" style={{ animationDelay: "0ms" }}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center font-bold shadow-lg">
                S
              </div>
              <span className="text-sm tracking-wide text-orange-200/80">
                Savory Haven
              </span>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl leading-[1.08] mb-6 fade-in-up"
              style={{ animationDelay: "80ms" }}
            >
              Good food finds
              <br />
              its way home.
            </h1>

            <div
              className="h-8 overflow-hidden fade-in-up"
              style={{ animationDelay: "160ms" }}
            >
              <p
                key={taglineIndex}
                className="text-orange-100/90 text-lg tagline-swap flex items-center gap-2"
              >
                <Flame size={16} className="text-orange-400 flex-shrink-0" />
                {TAGLINES[taglineIndex]}
              </p>
            </div>

            <div
              className="hidden lg:block mt-16 pt-8 border-t border-white/10 fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              <p className="text-sm text-orange-100/60 leading-relaxed max-w-xs">
                Sign in to pick up where you left off — your saved
                addresses, past orders, and reservations are all
                waiting.
              </p>
            </div>

          </div>
        </div>

        {/* =================================================
            RIGHT — LOGIN FORM
        ================================================= */}

        <div className="flex items-center justify-center px-6 py-14 sm:px-12">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm fade-in-up"
            style={{ animationDelay: "120ms" }}
          >

            <h2 className="font-display text-3xl text-[#2A1810] mb-2">
              Welcome back
            </h2>

            <p className="text-[#7A6A5E] mb-9">
              Log in to order your favorite food.
            </p>

            {/* EMAIL */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                Email address
              </label>

              <div className="relative field-wrap">
                <Mail
                  size={18}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-[#8B6F52]"
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  className="w-full pl-7 pb-3 bg-transparent border-b-2 border-[#E8DDD0] outline-none text-[#2A1810] placeholder:text-[#B8A896] focus:border-orange-500 transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                Password
              </label>

              <div className="relative field-wrap">
                <Lock
                  size={18}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-[#8B6F52]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  className="w-full pl-7 pr-9 pb-3 bg-transparent border-b-2 border-[#E8DDD0] outline-none text-[#2A1810] placeholder:text-[#B8A896] focus:border-orange-500 transition-colors disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8B6F52] hover:text-orange-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER ME */}

            <label className="flex items-center gap-2.5 mb-7 cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 rounded border-[#E8DDD0] text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer"
              />
              <span className="text-sm text-[#5C4A3D]">
                Remember me on this device
              </span>
            </label>

            {/* RATE LIMIT NOTICE */}

            {isRateLimited && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">
                Too many login attempts. Please try again in{" "}
                {cooldownSeconds}s.
              </p>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading || isRateLimited}
              className="relative w-full overflow-hidden bg-gradient-to-r from-orange-600 to-red-500 text-white py-3.5 rounded-2xl font-semibold shadow-lg shadow-orange-600/20 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <span className="relative z-10">
                {isRateLimited
                  ? `Try again in ${cooldownSeconds}s`
                  : loading
                  ? "Logging in..."
                  : "Log in"}
              </span>
              <span className="shine" />
            </button>

            {/* OR */}

            <div className="my-7 flex items-center gap-3">
              <div className="h-px bg-[#E8DDD0] flex-1" />
              <span className="text-xs text-[#8B7355] tracking-wide">
                or continue with
              </span>
              <div className="h-px bg-[#E8DDD0] flex-1" />
            </div>

            {/* GOOGLE */}

            <div
              className={`flex justify-center transition-all ${
                isRateLimited
                  ? "opacity-40 blur-[1.5px] grayscale pointer-events-none select-none"
                  : ""
              }`}
              aria-disabled={isRateLimited}
            >
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login failed")}
              />
            </div>

            {isRateLimited && (
              <p className="text-center text-xs text-[#8B7355] mt-2">
                Google login is also paused during the cooldown.
              </p>
            )}

            {/* REGISTER */}

            <p className="text-center text-sm text-[#7A6A5E] mt-9">
              New to Savory Haven?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                disabled={loading}
                className="text-orange-600 font-semibold hover:text-orange-700 disabled:opacity-50"
              >
                Create an account
              </button>
            </p>

          </form>
        </div>

      </div>

      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        .font-display {
          font-family: 'Fraunces', serif;
          font-optical-sizing: auto;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes taglineSwap {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .tagline-swap {
          animation: taglineSwap 0.5s ease forwards;
        }

        @keyframes blobDriftA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 25px) scale(1.08); }
        }

        @keyframes blobDriftB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, -20px) scale(1.1); }
        }

        @keyframes blobDriftC {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -15px); }
        }

        .blob-a { animation: blobDriftA 9s ease-in-out infinite; }
        .blob-b { animation: blobDriftB 11s ease-in-out infinite; }
        .blob-c { animation: blobDriftC 7s ease-in-out infinite; }

        .shine {
          position: absolute;
          top: 0;
          left: -60%;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255,255,255,0.35),
            transparent
          );
          transform: skewX(-20deg);
        }

        .group:hover .shine {
          animation: shineSweep 0.9s ease forwards;
        }

        @keyframes shineSweep {
          from { left: -60%; }
          to { left: 130%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-in-up, .tagline-swap, .blob-a, .blob-b, .blob-c, .group:hover .shine {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}

export default Loginpage;