import { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  CalendarDays,
  IndianRupee,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders, getAuthUser } from "./authStorage";
import { useToast } from "./Toast";

type DashboardData = {
  total_users: number;
  total_orders: number;
  total_reservations: number;
  revenue: number;
};

// =========================================================
// COUNT-UP NUMBER
// Numbers 0 se apni value tak smoothly animate hote hain,
// jisse dashboard "live" feel karta hai.
// =========================================================

function CountUp({
  value,
  duration = 900,
  prefix = "",
}: {
  value: number;
  duration?: number;
  prefix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <>
      {prefix}
      {display.toLocaleString("en-IN")}
    </>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [data, setData] = useState<DashboardData>({
    total_users: 0,
    total_orders: 0,
    total_reservations: 0,
    revenue: 0,
  });

  const admin = getAuthUser();

  const getApiUrl = () => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://10.201.230.252:8000";
    }

    return import.meta.env.VITE_API_URL;
  };

  const fetchDashboard = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    try {
      const response = await fetch(
        `${getApiUrl()}/admin/dashboard`,
        {
          headers: getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.detail || "Unable to load dashboard data");
        return;
      }

      setData(result);
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =========================================================
  // DERIVED METRICS (real numbers, calculated from live data —
  // no fabricated "trend" percentages)
  // =========================================================

  const averageOrderValue =
    data.total_orders > 0
      ? Math.round(data.revenue / data.total_orders)
      : 0;

  const ordersPerUser =
    data.total_users > 0
      ? (data.total_orders / data.total_users).toFixed(1)
      : "0.0";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  // =========================================================
  // LOADING SKELETON
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto animate-pulse space-y-6">
          <div className="h-36 rounded-3xl bg-orange-200/60" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="h-36 rounded-3xl bg-orange-100" />
            <div className="h-36 rounded-3xl bg-orange-100" />
            <div className="h-36 rounded-3xl bg-orange-100" />
            <div className="h-36 rounded-3xl bg-orange-100" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-40 rounded-3xl bg-orange-100" />
            <div className="h-40 rounded-3xl bg-orange-100" />
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: data.revenue,
      prefix: "₹",
      icon: IndianRupee,
      accent: "from-emerald-500 to-teal-600",
      note: `₹${averageOrderValue.toLocaleString("en-IN")} average per order`,
    },
    {
      label: "Total Orders",
      value: data.total_orders,
      prefix: "",
      icon: ShoppingBag,
      accent: "from-orange-500 to-red-500",
      note: `${ordersPerUser} orders per customer`,
    },
    {
      label: "Registered Users",
      value: data.total_users,
      prefix: "",
      icon: Users,
      accent: "from-blue-500 to-indigo-600",
      note: "People with an account",
    },
    {
      label: "Table Reservations",
      value: data.total_reservations,
      prefix: "",
      icon: CalendarDays,
      accent: "from-purple-500 to-fuchsia-600",
      note: "Bookings made so far",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0] pt-24 px-4 pb-16">
      <div className="max-w-6xl mx-auto">

        {/* =====================================================
            HERO HEADER
        ===================================================== */}

        <div
          className="relative overflow-hidden rounded-3xl bg-[#1F1410] text-[#FFF3E6] p-7 sm:p-9 mb-7 shadow-xl fade-up"
          style={{ animationDelay: "0ms" }}
        >
          <div className="pointer-events-none absolute -top-20 -right-12 w-64 h-64 rounded-full bg-orange-600/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 w-64 h-64 rounded-full bg-red-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-orange-300/80 text-sm font-medium mb-1">
                {today}
              </p>

              <h1 className="text-3xl sm:text-4xl font-extrabold">
                {greeting}
                {admin.name ? `, ${admin.name.split(" ")[0]}` : ""}
              </h1>

              <p className="text-orange-100/60 mt-2 max-w-md">
                Here's how Savory Haven is doing right now.
              </p>
            </div>

            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-semibold text-sm transition disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group relative bg-white rounded-3xl p-6 shadow-sm border border-orange-100/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden fade-up"
                style={{ animationDelay: `${80 + index * 70}ms` }}
              >
                {/* accent bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.accent}`}
                />

                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.accent} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon size={22} />
                </div>

                <p className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </p>

                <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                  <CountUp value={stat.value} prefix={stat.prefix} />
                </h2>

                <p className="text-xs text-gray-400 mt-2.5 flex items-center gap-1.5">
                  <TrendingUp size={13} className="flex-shrink-0" />
                  {stat.note}
                </p>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <h3
          className="text-lg font-bold text-gray-800 mb-4 fade-up"
          style={{ animationDelay: "380ms" }}
        >
          Manage
        </h3>

        <div className="grid md:grid-cols-2 gap-6">

          <button
            onClick={() => navigate("/admin/orders")}
            className="group text-left relative overflow-hidden bg-white rounded-3xl p-7 shadow-sm border border-orange-100/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 fade-up"
            style={{ animationDelay: "430ms" }}
          >
            <div className="pointer-events-none absolute -bottom-12 -right-10 w-40 h-40 rounded-full bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardList size={21} />
                </div>

                <h2 className="text-xl font-extrabold text-gray-900">
                  Manage Orders
                </h2>

                <p className="text-gray-500 mt-1.5 text-sm">
                  Track incoming orders and update their delivery status.
                </p>

                <span className="inline-block mt-4 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                  {data.total_orders} total
                </span>
              </div>

              <ArrowRight
                size={20}
                className="text-orange-400 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/reservations")}
            className="group text-left relative overflow-hidden bg-white rounded-3xl p-7 shadow-sm border border-orange-100/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 fade-up"
            style={{ animationDelay: "500ms" }}
          >
            <div className="pointer-events-none absolute -bottom-12 -right-10 w-40 h-40 rounded-full bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                  <CalendarCheck size={21} />
                </div>

                <h2 className="text-xl font-extrabold text-gray-900">
                  Manage Reservations
                </h2>

                <p className="text-gray-500 mt-1.5 text-sm">
                  Confirm, complete or cancel table bookings.
                </p>

                <span className="inline-block mt-4 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full">
                  {data.total_reservations} total
                </span>
              </div>

              <ArrowRight
                size={20}
                className="text-purple-400 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </button>

        </div>

      </div>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up {
          opacity: 0;
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;