import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, ArrowRight, Flame } from "lucide-react";
import type { CartItem, FoodItem } from "./FullMenu";
import { fullMenuItems } from "./FullMenu";

// =========================================================
// CHEF'S SPECIAL
// A small curated row of dishes on the Home page (Zomato /
// Domino's style) — same Add-to-cart behaviour as the rest
// of the site (button becomes a +/- stepper once added),
// but clicking anywhere else on the card opens the full
// food detail page instead.
// =========================================================

const SPECIAL_IDS = [92, 6, 89, 17];

const specials: FoodItem[] = SPECIAL_IDS.map(
  (id) => fullMenuItems.find((item) => item.id === id)!
).filter(Boolean);

type Props = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

export default function ChefsSpecial({ cartItems, setCartItems }: Props) {
  const navigate = useNavigate();

  const getQuantity = (id: number) => {
    const cartItem = cartItems.find((ci) => ci.id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  const addToCart = (item: FoodItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prev,
        { id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 },
      ];
    });
  };

  const increaseQuantity = (item: FoodItem) => {
    setCartItems((prev) =>
      prev.map((ci) => (ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci))
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => (ci.id === id ? { ...ci, quantity: ci.quantity - 1 } : ci))
        .filter((ci) => ci.quantity > 0)
    );
  };

  // Clicking the card (not the Add/stepper) opens the full
  // detail page — same navigation pattern used everywhere
  // else in the app (/food/:foodKey with the item in state).
  const openDetail = (item: FoodItem) => {
    navigate(`/food/fullmenu-${item.id}`, {
      state: {
        item: {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category,
        },
      },
    });
  };

  return (
    <section className="relative py-16 sm:py-20 bg-white overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
        .cs-font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-widest uppercase mb-4">
            <Flame size={14} />
            Chef's Special
          </div>
          <h2 className="cs-font-display text-3xl sm:text-4xl text-[#2A1810] mb-2">
            Chef's Special
          </h2>
          <p className="text-[#7A6A5E]">A curated selection of our most loved dishes</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {specials.map((item) => {
            const quantity = getQuantity(item.id);

            return (
              <div
                key={item.id}
                onClick={() => openDetail(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") openDetail(item);
                }}
                className="group bg-white rounded-2xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-3.5 sm:p-4">
                  <h3 className="font-bold text-[#2A1810] text-sm sm:text-base truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#9A8A7E] mb-2 truncate">{item.category}</p>

                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-orange-600 text-sm sm:text-base">
                      ₹{item.price}
                    </span>

                    {quantity === 0 ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        aria-label={`Add ${item.name} to cart`}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-red-500 text-white flex items-center justify-center shadow hover:scale-110 transition"
                      >
                        <ShoppingCart size={14} />
                      </button>
                    ) : (
                      <div
                        className="flex items-center rounded-full bg-orange-50 border border-orange-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="w-7 h-7 flex items-center justify-center text-orange-600"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-[#2A1810]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="w-7 h-7 flex items-center justify-center text-orange-600"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/fullmenu")}
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-orange-200 text-orange-700 font-bold hover:bg-orange-50 transition-all"
          >
            View Full Menu
            <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>
    </section>
  );
}