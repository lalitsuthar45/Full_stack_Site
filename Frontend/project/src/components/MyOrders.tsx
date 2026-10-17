import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Star,
  ShoppingBag,
  MapPin,
  CreditCard,
  Clock,
  XCircle,
  CheckCircle2,
  Package,
} from "lucide-react";
import { getAuthHeaders, getAuthUser } from "./authStorage";
import { useToast } from "./Toast";

type OrderItem = {
  food_name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  id: number;
  user_email?: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  payment_method: string;
  items_total: number;
  gst: number;
  delivery_charge: number;
  discount: number;
  grand_total: number;
  status: string;
  items: OrderItem[];
};

type FoodInfo = {
  description: string;
  rating: number;
  image: string;
  tag: string;
};

const foodInfo: Record<string, FoodInfo> = {
  Burger: {
    description: "Juicy patty in soft bun",
    rating: 4.8,
    tag: "Best Seller",
    image:
      "https://insanelygoodrecipes.com/wp-content/uploads/2020/10/Hamburger-with-Fresh-Vegetables.png",
  },

  Pizza: {
    description: "Cheesy crispy topped delight",
    rating: 4.7,
    tag: "Hot",
    image:
      "https://i.pinimg.com/736x/95/9d/07/959d075f1d43263e53f1bbff0dee4baf.jpg",
  },

  Noodles: {
    description: "Saucy spicy stir-fried strands",
    rating: 4.6,
    tag: "Popular",
    image:
      "https://i.pinimg.com/736x/f9/8c/0e/f98c0e31d5b512767447af7b1d35ac61.jpg",
  },

  "Pav Bhaji": {
    description: "Buttery spicy mashed vegetables",
    rating: 4.9,
    tag: "New",
    image:
      "https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=500",
  },

  "Veg Biryani": {
    description: "Aromatic spiced rice with vegetables",
    rating: 4.9,
    tag: "Best Seller",
    image:
      "https://i.pinimg.com/736x/2d/23/83/2d238302ba93305b76ce9017de063cab.jpg",
  },

  "Shahi Paneer": {
    description: "Rich creamy paneer with roti",
    rating: 4.8,
    tag: "Premium",
    image:
      "https://i.pinimg.com/736x/2e/f7/57/2ef757a94d658cc1b58ca352630debf6.jpg",
  },

  "Dal Bati": {
    description: "Smoky lentils with baked wheat balls",
    rating: 4.7,
    tag: "Rajasthani",
    image:
      "https://i.pinimg.com/736x/96/ab/cb/96abcbb605d6bb0f3e20c58afe9cb96a.jpg",
  },

  "Chole Bhature": {
    description: "Spicy chickpeas with fluffy bread",
    rating: 4.6,
    tag: "Popular",
    image:
      "https://i.pinimg.com/736x/37/5d/3b/375d3b1b6159172160c7bdbcdaffcbbe.jpg",
  },

  "Gulab Jamun": {
    description: "Milk-solid balls in sugar syrup",
    rating: 4.9,
    tag: "Sweet",
    image:
      "https://i.pinimg.com/736x/d7/57/aa/d757aaadf9cb57a72ee0143984c7338b.jpg",
  },

  Kheer: {
    description: "Creamy rice pudding with nuts",
    rating: 4.7,
    tag: "Classic",
    image:
      "https://i.pinimg.com/1200x/a1/12/02/a11202077fa9c8beee302a94cb62160b.jpg",
  },

  "Ras Malai": {
    description: "Soft paneer discs in saffron milk",
    rating: 4.8,
    tag: "Premium",
    image:
      "https://i.pinimg.com/736x/eb/f2/22/ebf222edc23a0f2414cbb2050bf67ee6.jpg",
  },

  Rasgulla: {
    description: "Spongy cottage cheese balls",
    rating: 4.6,
    tag: "Soft",
    image:
      "https://i.pinimg.com/736x/31/fb/61/31fb61d23d041061c567d304d80b36b2.jpg",
  },

  "Mango Juice": {
    description: "Sweet mango drink",
    rating: 4.8,
    tag: "Fresh",
    image:
      "https://i.pinimg.com/736x/ee/a6/f7/eea6f79fe565f6eec6ba355d794c3d97.jpg",
  },

  Lassi: {
    description: "Traditional yogurt drink",
    rating: 4.9,
    tag: "Cool",
    image:
      "https://i.pinimg.com/736x/ac/29/6b/ac296bc007f7d3f127daed3b0a181a38.jpg",
  },

  "Masala Chai": {
    description: "Indian spiced tea",
    rating: 4.7,
    tag: "Hot",
    image:
      "https://i.pinimg.com/736x/19/be/10/19be10b3f34cad7a6f7434eb3d7c5135.jpg",
  },

  Chaas: {
    description: "Traditional buttermilk",
    rating: 4.6,
    tag: "Healthy",
    image:
      "https://i.pinimg.com/1200x/93/ea/a4/93eaa4bdc21f9bacbaae17269b697199.jpg",
  },
};

function MyOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] =
    useState<number | null>(null);
  const [confirmCancelId, setConfirmCancelId] =
    useState<number | null>(null);

  // Currently opened food items
  const [openItems, setOpenItems] = useState<string[]>([]);

  const user = getAuthUser();

  const getApiUrl = () => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://10.201.230.252:8000";
    }

    return import.meta.env.VITE_API_URL;
  };

  // =========================
  // AUTH HEADER
  // Backend ke /orders route ko login token chahiye
  // (Depends(get_current_user)). Token na bheja jaye to
  // FastAPI seedha "Not authenticated" bhej deta hai.
  // =========================
  const fetchOrders = async () => {
    if (!user.email) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${getApiUrl()}/orders/${encodeURIComponent(user.email)}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Unable to load orders");
        setOrders([]);
        return;
      }

      const safeOrders = Array.isArray(data) ? data : [];

      const onlyMyOrders = safeOrders.filter((order: Order) => {
        if (!order.user_email) return true;

        return order.user_email === user.email;
      });

      setOrders(onlyMyOrders);
    } catch {
      toast.error("Unable to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user.email]);

  // =========================
  // TOGGLE FOOD DETAILS
  // =========================

  const toggleItem = (orderId: number, itemIndex: number) => {
    const itemKey = `${orderId}-${itemIndex}`;

    setOpenItems((previous) => {
      if (previous.includes(itemKey)) {
        return previous.filter((key) => key !== itemKey);
      }

      return [...previous, itemKey];
    });
  };

  const isItemOpen = (orderId: number, itemIndex: number) => {
    return openItems.includes(`${orderId}-${itemIndex}`);
  };

  // =========================
  // CANCEL ORDER
  // =========================

  const executeCancelOrder = async (orderId: number) => {
    setCancelLoadingId(orderId);

    try {
      const response = await fetch(
        `${getApiUrl()}/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Could not cancel order");
        return;
      }

      toast.success(data.message || "Order cancelled successfully");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: "Cancelled" }
            : order
        )
      );
    } catch {
      toast.error("Unable to connect to server");
    } finally {
      setCancelLoadingId(null);
    }
  };

  const canCancelOrder = (status: string) => {
    return status === "Pending";
  };

  // =========================
  // STATUS
  // =========================

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";

      case "Confirmed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";

      case "Preparing":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";

      case "Out For Delivery":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";

      case "Delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";

      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "Pending":
        return "Your order has been received.";

      case "Confirmed":
        return "Your order has been confirmed by the restaurant.";

      case "Preparing":
        return "Your food is being prepared.";

      case "Out For Delivery":
        return "Your order is on the way.";

      case "Delivered":
        return "Your order has been delivered.";

      case "Cancelled":
        return "This order has been cancelled.";

      default:
        return "";
    }
  };

  // =========================
  // FOOD INFORMATION
  // =========================

  const getFoodInfo = (foodName: string): FoodInfo => {
    return (
      foodInfo[foodName] || {
        description: "Delicious food prepared specially for you.",
        rating: 4.5,
        tag: "Food",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      }
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen pt-28 px-4 bg-orange-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-10 w-52 bg-orange-200 dark:bg-slate-800 rounded-xl" />

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg">
            <div className="h-6 w-40 bg-gray-200 dark:bg-slate-800 rounded mb-5" />
            <div className="space-y-3">
              <div className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl" />
              <div className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl" />
              <div className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950 pt-28 px-4 pb-16">

      {/* Cancel Confirmation Modal */}
      {confirmCancelId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-orange-100 dark:border-slate-800 text-center animate-slide-in">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cancel Order?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to cancel Order #{confirmCancelId}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmCancelId(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 dark:border-slate-700 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = confirmCancelId;
                  setConfirmCancelId(null);
                  executeCancelOrder(id);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md shadow-red-500/30 transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center text-white shadow-lg">
              <ShoppingBag size={24} />
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                My Orders
              </h1>

              <p className="text-gray-500 dark:text-gray-400">
                Track and manage your food orders
              </p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-10 text-center border border-orange-100 dark:border-slate-800">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 mb-5">
              <ShoppingBag size={38} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              No orders found
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Aapne abhi tak koi order nahi kiya.
            </p>
          </div>
        ) : (
          <div className="space-y-7">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-3xl shadow-xl border border-orange-100 dark:border-slate-800 overflow-hidden"
              >
                {/* ORDER HEADER */}

                <div className="p-6">
                  <div className="flex justify-between flex-wrap gap-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                          <Package size={22} />
                        </div>

                        <div>
                          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                            Order #{order.id}
                          </h2>

                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {order.payment_method}
                          </p>
                        </div>
                      </div>

                      {order.user_email && (
                        <p className="text-gray-400 text-sm mt-3">
                          {order.user_email}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                      <span
                        className={`${getStatusClass(
                          order.status
                        )} px-4 py-2 rounded-full font-bold text-sm`}
                      >
                        {order.status}
                      </span>

                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs md:text-right">
                        {getStatusMessage(order.status)}
                      </p>

                      {canCancelOrder(order.status) && (
                        <button
                          onClick={() => setConfirmCancelId(order.id)}
                          disabled={cancelLoadingId === order.id}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition disabled:opacity-60 font-semibold"
                        >
                          <XCircle size={18} />

                          {cancelLoadingId === order.id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* STATUS TRACKER */}

                  <div className="mt-7 overflow-x-auto pb-2">
                    <div className="min-w-[620px]">
                      <div className="flex items-center">
                        {[
                          "Pending",
                          "Confirmed",
                          "Preparing",
                          "Out For Delivery",
                          "Delivered",
                        ].map((status, index) => {
                          const statuses = [
                            "Pending",
                            "Confirmed",
                            "Preparing",
                            "Out For Delivery",
                            "Delivered",
                          ];

                          const currentIndex = statuses.indexOf(
                            order.status
                          );

                          const isCompleted =
                            currentIndex >= index &&
                            order.status !== "Cancelled";

                          const isCurrent =
                            order.status === status;

                          return (
                            <div
                              key={status}
                              className="flex flex-1 items-center"
                            >
                              <div className="flex flex-col items-center w-full">
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isCompleted
                                      ? "bg-orange-600 text-white"
                                      : "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
                                  } ${
                                    isCurrent
                                      ? "ring-4 ring-orange-100 dark:ring-orange-900/40 scale-110"
                                      : ""
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 size={18} />
                                  ) : (
                                    index + 1
                                  )}
                                </div>

                                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center mt-2 font-medium">
                                  {status}
                                </span>
                              </div>

                              {index < 4 && (
                                <div
                                  className={`h-1 flex-1 rounded ${
                                    currentIndex > index &&
                                    order.status !== "Cancelled"
                                      ? "bg-orange-600"
                                      : "bg-gray-200 dark:bg-slate-700"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* CANCELLED MESSAGE */}

                  {order.status === "Cancelled" && (
                    <div className="mt-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 p-4 rounded-2xl flex items-center gap-3">
                      <XCircle size={22} />

                      <span className="font-semibold">
                        This order has been cancelled.
                      </span>
                    </div>
                  )}

                  {/* =========================
                      FOOD ITEMS
                  ========================= */}

                  <div className="mt-7">
                    <div className="flex items-center gap-2 mb-4">
                      <ShoppingBag
                        size={20}
                        className="text-orange-600"
                      />

                      <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                        Ordered Items
                      </h3>

                      <span className="text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2.5 py-1 rounded-full font-bold">
                        {order.items.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, index) => {
                        const info = getFoodInfo(item.food_name);
                        const opened = isItemOpen(
                          order.id,
                          index
                        );

                        return (
                          <div
                            key={`${order.id}-${index}`}
                            className="border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-gray-50/70 dark:bg-slate-800/50"
                          >
                            {/* FOOD NAME ROW */}

                            <button
                              type="button"
                              onClick={() =>
                                toggleItem(order.id, index)
                              }
                              className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-orange-50 dark:hover:bg-slate-800 transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 flex-shrink-0">
                                  <UtensilsIcon />
                                </div>

                                <div className="min-w-0">
                                  <h4 className="font-bold text-gray-900 dark:text-white truncate">
                                    {item.food_name}
                                  </h4>

                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="font-bold text-orange-600">
                                  ₹{item.subtotal}
                                </span>

                                <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                                  {opened ? (
                                    <ChevronUp
                                      size={19}
                                      className="text-orange-600"
                                    />
                                  ) : (
                                    <ChevronDown
                                      size={19}
                                      className="text-orange-600"
                                    />
                                  )}
                                </div>
                              </div>
                            </button>

                            {/* =========================
                                EXPANDABLE DETAILS
                            ========================= */}

                            <div
                              className={`grid transition-all duration-500 ease-in-out ${
                                opened
                                  ? "grid-rows-[1fr] opacity-100"
                                  : "grid-rows-[0fr] opacity-0"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <div className="border-t border-gray-200 dark:border-slate-700 p-4">
                                  <div className="grid md:grid-cols-[220px_1fr] gap-5">
                                    {/* IMAGE */}

                                    <div className="relative h-48 md:h-44 rounded-2xl overflow-hidden">
                                      <img
                                        src={info.image}
                                        alt={item.food_name}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                      />

                                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600">
                                        {info.tag}
                                      </div>
                                    </div>

                                    {/* INFORMATION */}

                                    <div className="flex flex-col justify-between">
                                      <div>
                                        <div className="flex items-start justify-between gap-3">
                                          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                            {item.food_name}
                                          </h3>

                                          <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                            <Star
                                              size={18}
                                              className="fill-yellow-500"
                                            />
                                            {info.rating}
                                          </div>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                                          {info.description}
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-3 gap-3 mt-5">
                                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-gray-100 dark:border-slate-700">
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Price
                                          </p>

                                          <p className="font-extrabold text-orange-600 mt-1">
                                            ₹{item.price}
                                          </p>
                                        </div>

                                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-gray-100 dark:border-slate-700">
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Quantity
                                          </p>

                                          <p className="font-extrabold text-gray-900 dark:text-white mt-1">
                                            × {item.quantity}
                                          </p>
                                        </div>

                                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-gray-100 dark:border-slate-700">
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Subtotal
                                          </p>

                                          <p className="font-extrabold text-green-600 mt-1">
                                            ₹{item.subtotal}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* =========================
                      PRICE SUMMARY
                  ========================= */}

                  <div className="mt-7 bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-5">
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-white mb-4">
                      Bill Summary
                    </h3>

                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span>Items Total</span>
                        <span className="font-semibold">
                          ₹{order.items_total}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>GST</span>
                        <span className="font-semibold">
                          ₹{order.gst}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span className="font-semibold">
                          ₹{order.delivery_charge}
                        </span>
                      </div>

                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-semibold">
                          -₹{order.discount}
                        </span>
                      </div>

                      <hr className="border-gray-200 dark:border-slate-700" />

                      <div className="flex justify-between text-xl font-extrabold text-orange-600">
                        <span>Grand Total</span>
                        <span>₹{order.grand_total}</span>
                      </div>
                    </div>
                  </div>

                  {/* =========================
                      DELIVERY ADDRESS
                  ========================= */}

                  <div className="mt-5 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 p-5 rounded-2xl">
                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                      <MapPin size={20} />

                      <h3 className="font-extrabold">
                        Delivery Address
                      </h3>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mt-3 leading-6">
                      <strong>{order.customer_name}</strong>
                      <br />
                      {order.phone}
                      <br />
                      {order.address}, {order.city} -{" "}
                      {order.pincode}
                    </p>
                  </div>

                  {/* PAYMENT */}

                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CreditCard size={17} />
                    Payment Method:
                    <strong className="text-gray-700 dark:text-gray-200">
                      {order.payment_method}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   SMALL FOOD ICON
========================= */

function UtensilsIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3v18" />
      <path d="M3 3v5a4 4 0 0 0 8 0V3" />
      <path d="M17 3v18" />
      <path d="M21 3v5a4 4 0 0 1-4 4" />
    </svg>
  );
}

export default MyOrders;