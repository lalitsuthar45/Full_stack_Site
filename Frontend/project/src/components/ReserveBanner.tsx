import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ArrowRight,
  UtensilsCrossed,
  Users2,
  Star,
  MapPin,
} from "lucide-react";

// =========================================================
// RESERVE BANNER + STATS BAR
// Dark "Reserve Your Table" strip with a restaurant photo,
// followed by a 4-stat row — matches the reference layout,
// sits between Contact and Footer.
// =========================================================

const stats = [
  { icon: UtensilsCrossed, value: "10+", label: "Years of Experience" },
  { icon: Users2, value: "50K+", label: "Happy Customers" },
  { icon: Star, value: "25+", label: "Signature Dishes" },
  { icon: MapPin, value: "5", label: "Cities Served" },
];

export default function ReserveBanner() {
  const navigate = useNavigate();

  return (
    <section className="relative py-16 sm:py-20 bg-[#FFF8F0]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
        .rb-font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* RESERVE CARD */}
        <div className="relative rounded-[1.75rem] overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1600&q=80"
            alt="Reserved table setting"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F1410]/95 via-[#1F1410]/80 to-[#1F1410]/40" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 p-8 sm:p-12">
            <div>
              <span className="text-orange-400 font-bold tracking-widest text-xs uppercase">
                Reserve Your Table
              </span>

              <h3 className="rb-font-display text-3xl sm:text-4xl text-white mt-3 mb-3">
                Book Your Table Now
              </h3>

              <p className="text-white/70 max-w-md">
                Plan your special moments with us.
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">
                {["Easy Booking", "Instant Confirmation", "Best Experience"].map(
                  (item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 text-white/85 text-sm font-medium"
                    >
                      <CheckCircle2 size={16} className="text-orange-400" />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <button
              onClick={() => navigate("/reservation")}
              className="group shrink-0 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
            >
              Book a Table
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon className="w-6 h-6 mx-auto text-orange-600 mb-2" />
                <div className="rb-font-display text-2xl sm:text-3xl text-[#2A1810]">
                  {stat.value}
                </div>
                <div className="text-[#7A6A5E] text-xs sm:text-sm font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}