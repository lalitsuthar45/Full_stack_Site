import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import type { CartItem } from "./FullMenu";
import { getAuthHeaders, getAuthUser } from "./authStorage";
import { useToast } from "./Toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pythonfastapi-production-f08a.up.railway.app";

type FavoriteItem = {
  id: number;
  food_key: string;
  food_name: string;
  price: number;
  image?: string;
};

type FavouritesProps = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

function Favourites({ cartItems, setCartItems }: FavouritesProps) {
  const toast = useToast();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingKey, setRemovingKey] = useState<string | null>(null);

  const user = getAuthUser();
  const fetchFavorites = async () => {
    if (!user.email) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/favorites/${encodeURIComponent(user.email)}`,
        { headers: getAuthHeaders() }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Unable to load favorites");
        setFavorites([]);
        return;
      }

      setFavorites(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Unable to connect to server");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // =========================================================
  // REMOVE FROM FAVORITES
  // =========================================================

  const removeFavorite = async (foodKey: string) => {
    setRemovingKey(foodKey);

    try {
      const response = await fetch(
        `${API_URL}/favorites/${encodeURIComponent(foodKey)}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        toast.error("Could not remove favorite");
        return;
      }

      setFavorites((prev) =>
        prev.filter((item) => item.food_key !== foodKey)
      );
      toast.info("Removed from favorites");
    } catch {
      toast.error("Unable to connect to server");
    } finally {
      setRemovingKey(null);
    }
  };

  // =========================================================
  // ADD TO CART
  // food_key jaisa "menu-3" ya "fullmenu-12" hota hai — usme se
  // asli numeric id nikal kar cart mein add karte hain.
  // =========================================================

  const getCartQuantity = (numericId: number) => {
    const cartItem = cartItems.find((item) => item.id === numericId);
    return cartItem ? cartItem.quantity : 0;
  };

  const parseNumericId = (foodKey: string) => {
    const parts = foodKey.split("-");
    return parseInt(parts[parts.length - 1], 10);
  };

  const addToCart = (favorite: FavoriteItem) => {
    const numericId = parseNumericId(favorite.food_key);

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === numericId);

      if (existing) {
        return prev.map((item) =>
          item.id === numericId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: numericId,
          name: favorite.food_name,
          price: favorite.price,
          image: favorite.image,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (favorite: FavoriteItem) => {
    const numericId = parseNumericId(favorite.food_key);

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === numericId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (favorite: FavoriteItem) => {
    const numericId = parseNumericId(favorite.food_key);

    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === numericId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen pt-28 px-4 bg-orange-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-10 w-56 bg-orange-200 dark:bg-slate-800 rounded-xl" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-orange-100 dark:bg-slate-800 rounded-3xl" />
            <div className="h-64 bg-orange-100 dark:bg-slate-800 rounded-3xl" />
            <div className="h-64 bg-orange-100 dark:bg-slate-800 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950 pt-28 px-4 pb-16">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
            <Heart size={24} fill="currentColor" />
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
              My Favourites
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Items you've liked, ready to order anytime.
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {favorites.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-10 text-center border border-orange-100 dark:border-slate-800">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 mb-5">
              <Heart size={38} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              No favourites yet
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Menu ya Full Menu page pe kisi bhi dish ke heart icon pe
              tap karke usse yahan save karein.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const numericId = parseNumericId(favorite.food_key);
              const quantityInCart = getCartQuantity(numericId);

              return (
                <div
                  key={favorite.food_key}
                  className="group bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden border border-orange-100 dark:border-slate-800"
                >
                  {/* IMAGE */}
                  <div className="relative h-44 overflow-hidden bg-orange-100 dark:bg-slate-800">
                    {favorite.image && (
                      <img
                        src={favorite.image}
                        alt={favorite.food_name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    <button
                      onClick={() => removeFavorite(favorite.food_key)}
                      disabled={removingKey === favorite.food_key}
                      aria-label={`Remove ${favorite.food_name} from favourites`}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center shadow hover:scale-110 transition disabled:opacity-60"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>

                  {/* DETAILS */}
                  <div className="p-5">
                    <div className="flex justify-between gap-3 mb-3">
                      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white line-clamp-1">
                        {favorite.food_name}
                      </h3>

                      <span className="text-lg font-extrabold text-orange-600 flex-shrink-0">
                        ₹{favorite.price}
                      </span>
                    </div>

                    {quantityInCart === 0 ? (
                      <button
                        onClick={() => addToCart(favorite)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white py-2.5 rounded-2xl font-bold shadow hover:shadow-orange-300/50 hover:-translate-y-0.5 transition-all"
                      >
                        <ShoppingCart size={17} />
                        Add
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-between rounded-2xl bg-orange-50 dark:bg-slate-800 border border-orange-100 dark:border-slate-700 overflow-hidden">
                        <button
                          onClick={() => decreaseQuantity(favorite)}
                          aria-label={`Decrease quantity of ${favorite.food_name}`}
                          className="w-11 h-11 flex items-center justify-center text-orange-600 hover:bg-orange-100 dark:hover:bg-slate-700 transition font-bold"
                        >
                          −
                        </button>

                        <span className="font-bold text-gray-900 dark:text-white">
                          {quantityInCart}
                        </span>

                        <button
                          onClick={() => increaseQuantity(favorite)}
                          aria-label={`Increase quantity of ${favorite.food_name}`}
                          className="w-11 h-11 flex items-center justify-center text-orange-600 hover:bg-orange-100 dark:hover:bg-slate-700 transition font-bold"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favourites;