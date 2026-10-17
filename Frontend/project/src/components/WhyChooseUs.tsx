import { ChefHat, Soup, Leaf, Users2 } from "lucide-react";

// =========================================================
// WHY CHOOSE US
// Compact intro strip right under the Hero — a 4-icon
// "Why Dine With Us" row on the left and a short "Our
// Story" teaser on the right, matching the reference
// layout. The full story lives further down in About.tsx,
// so this stays short and scannable.
// =========================================================

const reasons = [
  {
    icon: Soup,
    title: "Fresh Ingredients",
    description: "Locally sourced & always fresh",
  },
  {
    icon: ChefHat,
    title: "Expert Chefs",
    description: "Crafted with passion",
  },
  {
    icon: Leaf,
    title: "Hygienic & Safe",
    description: "Highest quality standards",
  },
  {
    icon: Users2,
    title: "Warm Ambiance",
    description: "Perfect place to relax & enjoy",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-16 sm:py-20 bg-[#FFF8F0] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Great+Vibes&display=swap');
        .wcu-font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .wcu-font-script { font-family: 'Great Vibes', cursive; }
      `}</style>

      <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 items-center">
          {/* WHY DINE WITH US */}
          <div>
            <h2 className="wcu-font-display text-2xl sm:text-3xl text-[#2A1810] text-center lg:text-left mb-10">
              Why Dine With Us?
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {reasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <div key={reason.title} className="text-center group">
                    <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-md border border-orange-100 flex items-center justify-center mb-4 group-hover:-translate-y-1 group-hover:shadow-orange-200 transition-all duration-300">
                      <Icon className="w-7 h-7 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-[#2A1810] text-sm">
                      {reason.title}
                    </h3>
                    <p className="text-[#7A6A5E] text-xs mt-1 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OUR STORY TEASER */}
          <div className="text-center lg:text-left lg:border-l lg:border-orange-200 lg:pl-12">
            <h2 className="wcu-font-display text-2xl sm:text-3xl text-[#2A1810] mb-3">
              Our Story
            </h2>
            <p className="text-[#5C4A3D] leading-relaxed mb-4">
              Savory Haven is a celebration of flavors from around the world,
              crafted with love and served with a touch of tradition.
            </p>
            <p className="wcu-font-script text-2xl text-orange-600">
              Taste the Difference
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}