import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import {
  CONSENT_KEY,
  loadGoogleAnalytics,
} from "./analytics";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);

    if (consent === "accepted") {
      // Pehle se accept kiya hua hai — GA load kar dein,
      // banner dobara mat dikhayein.
      loadGoogleAnalytics();
    } else if (consent !== "declined") {
      // Pehli baar visit ho raha hai (na accept, na decline)
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    loadGoogleAnalytics();
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-orange-200 dark:border-slate-700 shadow-2xl p-5 md:p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-start md:items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 flex-shrink-0">
            <Cookie size={20} />
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300">
            We use cookies to improve your experience and understand
            website traffic (Google Analytics). By clicking "Accept",
            you agree to our use of cookies.
          </p>
        </div>

        <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
          <button
            onClick={handleDecline}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition"
          >
            Decline
          </button>

          <button
            onClick={handleAccept}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-500 text-white font-semibold hover:shadow-lg transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}