import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

export type ToastType = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
};

type ToastContextType = {
  showToast: (
    message: string,
    type?: ToastType,
    title?: string,
    duration?: number
  ) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
};

// =========================================================
// CONTEXT
// =========================================================

const ToastContext = createContext<ToastContextType | null>(null);

// =========================================================
// ICON MAP
// =========================================================

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: {
    bg: "bg-white dark:bg-slate-800",
    border: "border-green-400",
    icon: "text-green-500",
    title: "text-green-700 dark:text-green-400",
    bar: "bg-green-500",
  },
  error: {
    bg: "bg-white dark:bg-slate-800",
    border: "border-red-400",
    icon: "text-red-500",
    title: "text-red-700 dark:text-red-400",
    bar: "bg-red-500",
  },
  info: {
    bg: "bg-white dark:bg-slate-800",
    border: "border-blue-400",
    icon: "text-blue-500",
    title: "text-blue-700 dark:text-blue-400",
    bar: "bg-blue-500",
  },
  warning: {
    bg: "bg-white dark:bg-slate-800",
    border: "border-orange-400",
    icon: "text-orange-500",
    title: "text-orange-700 dark:text-orange-400",
    bar: "bg-orange-500",
  },
};

// =========================================================
// SINGLE TOAST ITEM
// =========================================================

function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: (id: string) => void;
}) {
  const Icon = iconMap[toast.type];
  const colors = colorMap[toast.type];
  const duration = toast.duration ?? 4000;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl shadow-lg
        border-l-4 ${colors.border} ${colors.bg}
        flex items-start gap-3 p-4
        w-full max-w-sm sm:max-w-md
        animate-slide-in
      `}
    >
      {/* Icon */}
      <div className={`shrink-0 mt-0.5 ${colors.icon}`}>
        <Icon size={22} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`text-sm font-bold mb-0.5 ${colors.title}`}>
            {toast.title}
          </p>
        )}
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug break-words">
          {toast.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition ml-1"
      >
        <X size={16} />
      </button>

      {/* Auto-dismiss progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-1 ${colors.bar} rounded-b-2xl`}
        style={{
          animation: `shrink-bar ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
}

// =========================================================
// TOAST CONTAINER
// =========================================================

function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: Toast[];
  onClose: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed z-[9999] flex flex-col gap-2 pointer-events-none
      bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm
      sm:bottom-6 sm:right-4 sm:left-auto sm:translate-x-0 sm:w-auto sm:max-w-sm
    ">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

// =========================================================
// PROVIDER
// =========================================================

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
      title?: string,
      duration = 4000
    ) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev.slice(-4), { id, type, title, message, duration }]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => showToast(message, "success", title),
    [showToast]
  );

  const error = useCallback(
    (message: string, title?: string) => showToast(message, "error", title, 5000),
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string) => showToast(message, "info", title),
    [showToast]
  );

  const warning = useCallback(
    (message: string, title?: string) => showToast(message, "warning", title),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

// =========================================================
// HOOK
// =========================================================

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
