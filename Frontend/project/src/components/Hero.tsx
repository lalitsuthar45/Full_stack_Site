import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// =========================================================
// HERO
// Dark, full-bleed restaurant-photo hero (Savora/Domino's
// app style) — eyebrow script line, big heading with a
// gradient accent word, two CTAs, and slide dots at the
// bottom. Matches the espresso-brown / orange-red theme
// used across Login, Register, Footer, About, Gallery.
// =========================================================

const slides = [
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1600&q=80",
];

export default function Hero() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToStory = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-end overflow-hidden"
    >
      {/* fonts, matching rest of the site */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Great+Vibes&display=swap');
        .hero-font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .hero-font-script { font-family: 'Great Vibes', cursive; }
      `}</style>

      {/* background slides */}
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* dark gradient overlay so text always reads clearly */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F1410] via-[#1F1410]/70 to-[#1F1410]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1F1410]/80 via-[#1F1410]/20 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-40">
        <p className="hero-font-script text-3xl sm:text-4xl text-orange-400 mb-2">
          Good Food, Great Vibes
        </p>

        <h1 className="hero-font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.08] max-w-3xl">
          Delicious Food
          <br />
          Made for{" "}
          <span className="hero-font-script bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            You
          </span>
        </h1>

        <p className="text-base sm:text-lg text-white/80 mt-6 max-w-xl leading-relaxed">
          Experience a perfect blend of authentic flavors, warm ambiance and
          unforgettable moments — only at Savory Haven.
        </p>

        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={() => navigate("/fullmenu")}
            className="group px-7 py-3.5 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-full font-bold shadow-xl hover:shadow-orange-500/40 transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            Explore Menu
            <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={scrollToStory}
            className="px-7 py-3.5 bg-transparent text-white rounded-full font-bold border-2 border-white/40 hover:bg-white/10 hover:border-white transition-all"
          >
            Our Story
          </button>
        </div>

        {/* slide dots */}
        <div className="flex items-center gap-2 mt-14">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-8 bg-orange-500" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 hidden md:flex flex-col items-center text-white/60 z-10">
        <span className="text-xs mb-2 tracking-widest uppercase">Scroll</span>
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-orange-400 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}