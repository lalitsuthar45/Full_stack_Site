import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleLogin,
  type CredentialResponse,
} from "@react-oauth/google";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Flame,
} from "lucide-react";

import { useAuth } from "./AuthContext";
import { useToast } from "./Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://full-stack-site-tau.vercel.app";

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
  "First order's on the house — the good mood, at least.",
  "Save your address once, order in seconds forever.",
  "Track your food from kitchen to doorstep.",
  "Reserve a table for tonight, too.",
];

function Registerpage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  // =====================================================
  // SAVE AUTHENTICATION
  // =====================================================

  const saveUser = (
    user: UserData,
    accessToken: string,
    _message: string
  ) => {
    login(user, accessToken);
    // Direct login into website without blocking alert
    navigate("/home", { replace: true });
  };

  // =====================================================
  // GOOGLE LOGIN / REGISTER
  // =====================================================

  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) {
      toast.error("Google login failed: No token received");
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
  // INPUT CHANGE
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (!name || !email || !password) {
      toast.warning("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Registration failed");
        return;
      }

      if (!data.access_token) {
        toast.error(
          "Registration successful, but authentication token was not received."
        );
        return;
      }

      saveUser(
        data.user,
        data.access_token,
        data.message || "Registration successful"
      );
    } catch (error) {
      console.error("Register Error:", error);
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
          <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-red-500/25 blur-3xl blob-a" />
          <div className="pointer-events-none absolute bottom-[-4rem] left-[-3rem] w-80 h-80 rounded-full bg-orange-600/30 blur-3xl blob-b" />
          <div className="pointer-events-none absolute top-1/4 left-10 w-40 h-40 rounded-full bg-amber-400/20 blur-2xl blob-c" />

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
              Pull up a chair.
              <br />
              We saved you a seat.
            </h1>

            <div
              className="min-h-[3.5rem] overflow-hidden fade-in-up"
              style={{ animationDelay: "160ms" }}
            >
              <p
                key={taglineIndex}
                className="text-orange-100/90 text-lg tagline-swap flex items-start gap-2"
              >
                <Flame size={16} className="text-orange-400 flex-shrink-0 mt-1" />
                <span>{TAGLINES[taglineIndex]}</span>
              </p>
            </div>

            <div
              className="hidden lg:block mt-14 pt-8 border-t border-white/10 fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              <p className="text-sm text-orange-100/60 leading-relaxed max-w-xs">
                Already have an account with us?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-orange-300 font-semibold hover:text-orange-200 underline underline-offset-2"
                >
                  Log in instead
                </button>
              </p>
            </div>

          </div>
        </div>

        {/* =================================================
            RIGHT — REGISTER FORM
        ================================================= */}

        <div className="flex items-center justify-center px-6 py-14 sm:px-12">
          <form
            onSubmit={handleRegister}
            className="w-full max-w-sm fade-in-up"
            style={{ animationDelay: "120ms" }}
          >

            <h2 className="font-display text-3xl text-[#2A1810] mb-2">
              Create your account
            </h2>

            <p className="text-[#7A6A5E] mb-9">
              Join us and start ordering in minutes.
            </p>

            {/* NAME */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                Full name
              </label>

              <div className="relative field-wrap">
                <User
                  size={18}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-[#7A5533]"
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="name"
                  required
                  className="w-full pl-7 pb-3 bg-transparent border-b-2 border-[#E8DDD0] outline-none text-[#2A1810] placeholder:text-[#7A6A5E] focus:border-orange-500 transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                Email address
              </label>

              <div className="relative field-wrap">
                <Mail
                  size={18}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-[#7A5533]"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                  required
                  className="w-full pl-7 pb-3 bg-transparent border-b-2 border-[#E8DDD0] outline-none text-[#2A1810] placeholder:text-[#7A6A5E] focus:border-orange-500 transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="mb-2">
              <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                Password
              </label>

              <div className="relative field-wrap">
                <Lock
                  size={18}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-[#7A5533]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="new-password"
                  required
                  className="w-full pl-7 pr-9 pb-3 bg-transparent border-b-2 border-[#E8DDD0] outline-none text-[#2A1810] placeholder:text-[#7A6A5E] focus:border-orange-500 transition-colors disabled:opacity-60"
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

            <p className="text-xs text-[#8B7355] mb-8">
              Minimum 6 characters.
            </p>

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden bg-gradient-to-r from-orange-600 to-red-500 text-white py-3.5 rounded-2xl font-semibold shadow-lg shadow-orange-600/20 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <span className="relative z-10">
                {loading ? "Creating account..." : "Create account"}
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

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login failed")}
              />
            </div>

            {/* LOGIN */}

            <p className="text-center text-sm text-[#7A6A5E] mt-9">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={loading}
                className="text-orange-800 font-semibold hover:text-orange-900 disabled:opacity-50"
              >
                Log in
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
          50% { transform: translate(-28px, 22px) scale(1.08); }
        }

        @keyframes blobDriftB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, -20px) scale(1.1); }
        }

        @keyframes blobDriftC {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, 15px); }
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

export default Registerpage;