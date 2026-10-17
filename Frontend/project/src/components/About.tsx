import { Award, Heart, Users, Clock, Star } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Only the finest ingredients from trusted local suppliers",
      accent: "from-orange-500 to-red-500",
    },
    {
      icon: Heart,
      title: "Made with Love",
      description:
        "Every dish is crafted with passion and attention to detail",
      accent: "from-red-500 to-rose-600",
    },
    {
      icon: Users,
      title: "Expert Chefs",
      description: "Our team brings decades of culinary expertise",
      accent: "from-amber-500 to-orange-600",
    },
    {
      icon: Clock,
      title: "Always Fresh",
      description: "Prepared fresh daily to ensure the best taste",
      accent: "from-orange-600 to-amber-500",
    },
  ];

  const stats = [
    { value: "15+", label: "Years Serving" },
    { value: "25+", label: "Expert Chefs" },
    { value: "100%", label: "Satisfaction" },
  ];

  return (
    <section
      id="about"
      className="relative py-24 bg-[#FFF8F0] overflow-hidden"
    >
      {/* Decorative warm blobs, consistent with the rest of the site */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full bg-red-300/15 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* =================================================
              LEFT — STORY
          ================================================= */}
          <div className="fade-up" style={{ animationDelay: "0ms" }}>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 shadow text-orange-700 font-semibold mb-6">
              <Star size={16} className="fill-orange-500 text-orange-500" />
              Our Story
            </div>

            <h2 className="font-display text-4xl md:text-5xl text-[#2A1810] mb-6 leading-[1.1]">
              About{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                Savory Haven
              </span>
            </h2>

            <p className="text-lg text-[#5C4A3D] mb-5 leading-relaxed">
              Since 2009, Savory Haven has been delighting food lovers
              with our unique blend of traditional recipes and modern
              culinary techniques. Our passion for excellence drives us
              to source the freshest ingredients and create
              unforgettable dining experiences.
            </p>

            <p className="text-lg text-[#5C4A3D] mb-8 leading-relaxed">
              Whether you're joining us for a casual lunch, romantic
              dinner, or special celebration, our dedicated team is
              committed to making every visit memorable. We believe
              that great food brings people together, and we're
              honored to be part of your special moments.
            </p>

            {/* STATS */}
            <div className="flex flex-wrap gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white px-6 py-4 rounded-2xl shadow-md border border-orange-100"
                >
                  <div className="font-display text-3xl text-orange-600">
                    {stat.value}
                  </div>
                  <div className="text-[#7A6A5E] text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              RIGHT — IMAGE
          ================================================= */}
          <div
            className="relative fade-up"
            style={{ animationDelay: "120ms" }}
          >
            <div className="relative rounded-[1.75rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Restaurant interior"
                className="w-full h-[420px] sm:h-[500px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-8 -left-6 sm:-left-8 bg-white p-6 sm:p-7 rounded-2xl shadow-xl border border-orange-100">
              <div className="flex items-center gap-1 mb-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-display text-2xl text-orange-600">
                  4.9/5
                </span>
              </div>
              <div className="text-[#7A6A5E] text-sm font-medium">
                Customer Rating
              </div>
            </div>
          </div>

        </div>

        {/* =================================================
            FEATURES
        ================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group bg-white rounded-3xl p-7 shadow-sm border border-orange-100/80 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 fade-up"
                style={{ animationDelay: `${220 + index * 80}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-lg font-extrabold text-[#2A1810] mb-2">
                  {feature.title}
                </h3>

                <p className="text-[#7A6A5E] leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');

        .font-display {
          font-family: 'Fraunces', serif;
          font-optical-sizing: auto;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up {
          opacity: 0;
          animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up { animation: none; opacity: 1; }
        }
      `}</style>
    </section>
  );
}