import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Heart,
} from "lucide-react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#1F1410] text-orange-100/80 pt-16 pb-8 overflow-hidden">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-24 left-1/4 w-72 h-72 rounded-full bg-orange-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 w-72 h-72 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-lg">
                S
              </div>
              <span className="text-xl font-extrabold text-white">
                Savory Haven
              </span>
            </div>

            <p className="text-sm leading-relaxed text-orange-100/60">
              Fresh, fast and delicious food delivered straight to your
              door. Cooked with care, served with love.
            </p>

            {/* SOCIAL */}
            <div className="flex items-center gap-3 mt-5">
              {/* NOTE: "#" placeholders — replace with your real profile links */}
              <a
                href="https://www.instagram.com/savoryhaven"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-600 flex items-center justify-center transition"
              >
                <Instagram size={17} />
              </a>

              <a
                href="https://www.facebook.com/savoryhaven"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-600 flex items-center justify-center transition"
              >
                <Facebook size={17} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-600 flex items-center justify-center transition"
              >
                <Twitter size={17} />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>

            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="hover:text-orange-400 transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("menu")}
                  className="hover:text-orange-400 transition"
                >
                  Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-orange-400 transition"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("gallery")}
                  className="hover:text-orange-400 transition"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-orange-400 transition"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <span>
                  123 Siyana Avenue, Jalore District
                  <br />
                  Rajasthan, 343024
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone size={18} className="text-orange-400 flex-shrink-0" />
                <a href="tel:+7878037679" className="hover:text-orange-400 transition">
                  +91 78780 37679
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail size={18} className="text-orange-400 flex-shrink-0" />
                <a href="mailto:info@savoryhaven.com" className="hover:text-orange-400 transition">
                  info@savoryhaven.com
                </a>
              </li>
            </ul>
          </div>

          {/* HOURS */}
          <div>
            <h3 className="text-white font-bold mb-4">Opening Hours</h3>

            <ul className="space-y-2 text-sm text-orange-100/70">
              <li className="flex justify-between gap-4">
                <span>Mon – Fri</span>
                <span>11:00 AM – 10:00 PM</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sat – Sun</span>
                <span>10:00 AM – 11:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-orange-100/50">
          <p>© {year} Savory Haven. All rights reserved.</p>

          <p className="flex items-center gap-1.5">
            Made with <Heart size={13} className="text-red-500 fill-red-500" /> for good food.
          </p>
        </div>

      </div>
    </footer>
  );
}