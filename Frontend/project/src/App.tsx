import { Suspense, lazy, useEffect, useState } from "react";

import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhyChooseUs from "./components/WhyChooseUs";
import MenuSection from "./components/MenuSection";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import ReserveBanner from "./components/ReserveBanner";
import Footer from "./components/Footer";
import Loginpage from "./components/Loginpage";
import Registerpage from "./components/Registerpage";

import { AuthProvider, useAuth } from "./components/AuthContext";
import CookieConsent from "./components/CookieConsent";
import { trackPageView } from "./components/analytics";

import type { CartItem } from "./components/FullMenu";

// =========================================================
// LAZY COMPONENTS
// =========================================================

const FullMenu = lazy(() => import("./components/FullMenu"));
const CartPage = lazy(() => import("./components/CartPage"));
const Profile = lazy(() => import("./components/Profile"));
const Reservation = lazy(() => import("./components/Reservation"));
const MyOrders = lazy(() => import("./components/MyOrders"));

const AdminDashboard = lazy(
  () => import("./components/AdminDashboard")
);

const AdminOrders = lazy(
  () => import("./components/AdminOrders")
);

const AdminReservations = lazy(
  () => import("./components/AdminReservations")
);

const Favourites = lazy(
  () => import("./components/Favourites")
);

const FoodDetail = lazy(
  () => import("./components/FoodDetail")
);

// =========================================================
// TYPES
// =========================================================

type HomePageProps = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isMenuOpen: boolean;
};

// =========================================================
// PAGE LOADER
// =========================================================

function PageLoader() {
  return (
    <div className="min-h-screen pt-24 px-4 bg-orange-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 w-56 rounded-xl bg-orange-200 dark:bg-slate-800" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-56 rounded-3xl bg-orange-100 dark:bg-slate-800" />
          <div className="h-56 rounded-3xl bg-orange-100 dark:bg-slate-800" />
          <div className="h-56 rounded-3xl bg-orange-100 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

// =========================================================
// SCROLL TO TOP
// =========================================================

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // SPA hai, isliye har route change pe Google Analytics ko
    // manually batana padta hai ki naya "page view" hua hai.
    // (Agar user ne consent nahi diya, trackPageView khud hi
    // kuch nahi karega.)
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}

// =========================================================
// HOME PAGE
// =========================================================

function HomePage({
  cartItems,
  setCartItems,
  isMenuOpen,
}: HomePageProps) {
  return (
    <main
      className={`page-transition pt-16 transition-transform duration-300 ${
        isMenuOpen ? "translate-x-64" : "translate-x-0"
      }`}
    >
      <Hero />
      <WhyChooseUs />
      <MenuSection cartItems={cartItems} setCartItems={setCartItems} />
      <About />
      <Gallery />
      <Contact />
      <ReserveBanner />
      <Footer />
    </main>
  );
}

// =========================================================
// PUBLIC ROUTE (reads auth from context now, not props)
// =========================================================

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

// =========================================================
// PROTECTED ROUTE
// =========================================================

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// =========================================================
// ADMIN ROUTE
// =========================================================

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  // Login required
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Admin required
  if (currentUser.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

// =========================================================
// APP ROUTES (everything that needs useAuth lives inside
// AuthProvider, so it's split into its own component)
// =========================================================

function AppRoutes() {
  const { authLoading } = useAuth();

  // =======================================================
  // CART — localStorage se restore hota hai, taaki refresh
  // ya page reload ke baad bhi items bane rahein.
  // =======================================================

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const [isMenuOpen] = useState(false);

  if (authLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* LOGIN */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Loginpage />
              </PublicRoute>
            }
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Registerpage />
              </PublicRoute>
            }
          />

          {/* HOME */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />
                  <HomePage
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    isMenuOpen={isMenuOpen}
                  />
                </>
              </ProtectedRoute>
            }
          />

          {/* FULL MENU */}
          <Route
            path="/fullmenu"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />
                  <FullMenu
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                </>
              </ProtectedRoute>
            }
          />

          {/* CART */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />
                  <CartPage
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                </>
              </ProtectedRoute>
            }
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />
                  <Profile />
                </>
              </ProtectedRoute>
            }
          />

          {/* MY ORDERS */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />
                  <MyOrders />
                </>
              </ProtectedRoute>
            }
          />

          {/* RESERVATION */}
          <Route
            path="/reservation"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />
                  <Reservation />
                </>
              </ProtectedRoute>
            }
          />

          {/* FAVOURITES */}
          <Route
            path="/favourites"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />
                  <Favourites
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                </>
              </ProtectedRoute>
            }
          />

          {/* FOOD DETAIL */}
          <Route
            path="/food/:foodKey"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />
                  <FoodDetail
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                </>
              </ProtectedRoute>
            }
          />

          {/* ADMIN DASHBOARD */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* ADMIN ORDERS */}
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          {/* ADMIN RESERVATIONS */}
          <Route
            path="/admin/reservations"
            element={
              <AdminRoute>
                <AdminReservations />
              </AdminRoute>
            }
          />

          {/* UNKNOWN URL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <CookieConsent />
    </>
  );
}

// =========================================================
// APP (wraps everything with AuthProvider)
// =========================================================

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;