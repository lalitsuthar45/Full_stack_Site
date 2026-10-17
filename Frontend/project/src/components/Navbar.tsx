import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  Home,
  Utensils,
  Image,
  Phone,
  Info,
  ChevronDown,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "./FullMenu";
import { useAuth } from "./AuthContext";

interface NavbarProps {
  cartItems: CartItem[];
}

export default function Navbar({ cartItems }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // =====================================================
  // NEW CART ITEM NOTIFICATION (blinking dot)
  // Jab bhi cart mein total quantity badhti hai, blink
  // start ho jata hai. Cart section open hote hi (button
  // click) blink band ho jata hai.
  // =====================================================

  const [hasNewCartItem, setHasNewCartItem] = useState(false);

  const totalCartQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const prevCartQuantityRef = useRef(totalCartQuantity);

  useEffect(() => {
    if (totalCartQuantity > prevCartQuantityRef.current) {
      setHasNewCartItem(true);
    }

    prevCartQuantityRef.current = totalCartQuantity;
  }, [totalCartQuantity]);

  const navigate = useNavigate();

  // Ab currentUser AuthContext se aa raha hai, direct
  // localStorage parse nahi ho raha — hamesha sync rahega.
  const { currentUser, logout } = useAuth();
  const user = currentUser || { name: "", email: "" };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setProfileOpen(false);

    if (window.location.pathname !== "/home") {
      navigate("/home");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 250);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }

    setIsMenuOpen(false);
  };

  // =====================================================
  // LOGOUT
  // AuthContext ka logout() currentUser state ko turant
  // null kar deta hai, isliye ProtectedRoute turant "/" pe
  // bhej dega — koi refresh ki zaroorat nahi.
  // =====================================================

  const handleLogout = () => {
    setProfileOpen(false);
    setIsMenuOpen(false);
    logout();
    navigate("/", { replace: true });
  };

  // =====================================================
  // GO TO CART
  // Cart open hote hi naye item ka blink band ho jata hai.
  // =====================================================

  const goToCart = () => {
    setHasNewCartItem(false);
    navigate("/cart");
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Home", id: "home", icon: <Home size={18} /> },
    { name: "Menu", id: "menu", icon: <Utensils size={18} /> },
    { name: "About", id: "about", icon: <Info size={18} /> },
    { name: "Gallery", id: "gallery", icon: <Image size={18} /> },
    { name: "Contact", id: "contact", icon: <Phone size={18} /> },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-orange-100"
            : "bg-white/95 shadow-sm"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 flex justify-between items-center transition-all duration-300 ${
            scrolled ? "py-3" : "py-4"
          }`}
        >
          <button
            onClick={() => scrollToSection("home")}
            className="group flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition">
              S
            </div>

            <div className="leading-tight text-left">
              <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                Savory Haven
              </h1>
              <p className="hidden sm:block text-xs text-gray-500">
                Fresh • Fast • Delicious
              </p>
            </div>
          </button>

          <ul className="hidden lg:flex items-center gap-2 font-medium">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition"
                >
                  {item.icon}
                  {item.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={goToCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 font-semibold hover:bg-orange-100 transition"
            >
              <ShoppingCart size={20} />
              Cart

              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 rounded-full font-semibold hover:shadow-md transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center">
                  <User size={18} />
                </div>

                <span className="max-w-28 truncate">
                  {user.name || "Profile"}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition ${
                    profileOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-4 border border-orange-100 animate-dropdown">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email || "user@email.com"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full mt-3 text-left px-3 py-2 hover:bg-orange-50 rounded-xl flex items-center gap-2 text-gray-700"
                  >
                    <User size={18} />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/favourites");
                    }}
                    className="w-full mt-1 text-left px-3 py-2 hover:bg-orange-50 rounded-xl flex items-center gap-2 text-gray-700"
                  >
                    <Heart size={18} />
                    Favourites
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full mt-1 text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-xl flex gap-2 items-center"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* =====================================================
              MOBILE HAMBURGER
              Naya item add hone par is icon ke top-right corner
              pe blinking red dot dikhta hai, jab tak Cart section
              open na ho jaye.
          ===================================================== */}

          <button
            className="relative md:hidden w-11 h-11 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}

            {hasNewCartItem && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white" />
              </span>
            )}
          </button>
        </div>
      </nav>
            {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white/95 backdrop-blur-xl shadow-2xl z-40 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-24 px-6">

          {/* User Card */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h2 className="mt-3 text-lg font-bold truncate">
              {user.name || "Guest User"}
            </h2>

            <p className="text-sm opacity-90 truncate">
              {user.email || "user@email.com"}
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-8 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700 transition"
              >
                {item.icon}
                {item.name}
              </button>
            ))}

            {/* =====================================================
                CART BUTTON (SIDEBAR)
                Naya item add hone par ye button bhi blink karta
                hai (ring + pulse), taaki user ko exactly pata
                chale kahan click karna hai. Click karte hi blink
                band ho jata hai.
            ===================================================== */}

            <button
              onClick={goToCart}
              className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                hasNewCartItem
                  ? "bg-red-50 ring-2 ring-red-400 animate-pulse"
                  : "hover:bg-orange-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} />
                Cart
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                  {cartItems.length}
                </span>

                {hasNewCartItem && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => {
                navigate("/favourites");
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700 transition"
            >
              <Heart size={20} />
              Favourites
            </button>

            <button
              onClick={() => {
                navigate("/profile");
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700 transition"
            >
              <User size={20} />
              My Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Dropdown Animation */}
      <style>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-dropdown{
          animation: dropdown .25s ease;
        }
      `}</style>
    </>
  );
}