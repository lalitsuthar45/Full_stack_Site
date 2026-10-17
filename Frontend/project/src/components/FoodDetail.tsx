import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Flame,
} from "lucide-react";
import type { CartItem } from "./FullMenu";

type FoodDetailItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  tag?: string;
  category?: string;
};

type FoodDetailProps = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

function FoodDetail({ cartItems, setCartItems }: FoodDetailProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { foodKey } = useParams();

  // Item data seedha navigation state se aati hai (jab card pe
  // click kiya jata hai). Agar koi seedha is URL pe aa jaye
  // (refresh, direct link), to state khaali hoga.
  const item = (location.state as { item?: FoodDetailItem } | null)
    ?.item;

  // =========================================================
  // ITEM NAHI MILA (direct URL access / refresh)
  // =========================================================

  if (!item || !foodKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-6 text-center bg-orange-50 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
          Item not found
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Please go back and select an item from the menu.
        </p>

        <button
          onClick={() => navigate("/home")}
          className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const cartItem = cartItems.find((ci) => ci.id === item.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // =========================================================
  // CART ACTIONS
  // =========================================================

  const addToCart = () => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.id === item.id);

      if (existing) {
        return prev.map((ci) =>
          ci.id === item.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }

      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = () => {
    setCartItems((prev) =>
      prev.map((ci) =>
        ci.id === item.id
          ? { ...ci, quantity: ci.quantity + 1 }
          : ci
      )
    );
  };

  const decreaseQuantity = () => {
    setCartItems((prev) =>
      prev
        .map((ci) =>
          ci.id === item.id
            ? { ...ci, quantity: ci.quantity - 1 }
            : ci
        )
        .filter((ci) => ci.quantity > 0)
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-32">

      {/* HERO IMAGE */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="absolute top-6 left-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </button>

        {item.tag && (
          <div className="absolute top-6 right-4 bg-white/90 px-3 py-1.5 rounded-full text-xs font-bold text-orange-600 shadow">
            {item.tag}
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="px-5 pt-6 max-w-2xl mx-auto">

        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {item.name}
          </h1>

          <span className="text-2xl font-extrabold text-orange-600 flex-shrink-0">
            ₹{item.price}
          </span>
        </div>

        {item.rating !== undefined && (
          <div className="flex items-center gap-1 text-yellow-500 font-bold mt-2">
            <Star size={18} className="fill-yellow-500" />
            {item.rating}
          </div>
        )}

        {item.category && (
          <span className="inline-block mt-3 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
            {item.category}
          </span>
        )}

        <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
          {item.description}
        </p>

        <div className="mt-6 flex items-center gap-2 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 px-4 py-3 rounded-2xl">
          <Flame size={18} />
          <span className="text-sm font-semibold">
            Freshly prepared once you order
          </span>
        </div>

      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 p-4 shadow-2xl z-40">
        <div className="max-w-2xl mx-auto flex items-center gap-3">

          {quantityInCart === 0 ? (

            <button
              onClick={addToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white py-3.5 rounded-2xl font-bold shadow-lg"
            >
              <ShoppingCart size={18} />
              Add to Cart — ₹{item.price}
            </button>

          ) : (

            <>
              <div className="flex items-center rounded-2xl bg-orange-50 dark:bg-slate-800 border border-orange-100 dark:border-slate-700">

                <button
                  onClick={decreaseQuantity}
                  aria-label="Decrease quantity"
                  className="w-12 h-12 flex items-center justify-center text-orange-600"
                >
                  <Minus size={18} />
                </button>

                <span className="w-10 text-center font-bold text-gray-900 dark:text-white">
                  {quantityInCart}
                </span>

                <button
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                  className="w-12 h-12 flex items-center justify-center text-orange-600"
                >
                  <Plus size={18} />
                </button>

              </div>

              <button
                onClick={() => navigate("/cart")}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-500 text-white py-3.5 rounded-2xl font-bold shadow-lg"
              >
                Go to Cart
              </button>
            </>

          )}

        </div>
      </div>

    </div>
  );
}

export default FoodDetail;
