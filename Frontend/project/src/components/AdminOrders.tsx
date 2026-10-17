import { useEffect, useState } from "react";
import { getAuthHeaders } from "./authStorage";
import { useToast } from "./Toast";

type OrderItem = {
  food_name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  id: number;
  user_email: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  payment_method: string;
  grand_total: number;
  status: string;
  items: OrderItem[];
};

const orderStatuses = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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
  // Backend ke /admin/* routes ko login token chahiye
  // (Depends(get_current_admin)). Token na bheja jaye to
  // FastAPI "Not authenticated" bhej deta hai.
  // =========================
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/admin/orders`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Unable to load orders");
        return;
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: number, status: string) => {
    setUpdatingId(orderId);

    try {
      const response = await fetch(
        `${getApiUrl()}/admin/orders/${orderId}/status?status=${encodeURIComponent(
          status
        )}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Status update failed");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      toast.success(`Order #${orderId} status updated to ${status}`);
    } catch {
      toast.error("Unable to connect to server");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.user_email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Preparing":
        return "bg-orange-100 text-orange-700";

      case "Out For Delivery":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 pt-28 text-center text-xl font-semibold">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 pt-28 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">
          Admin Orders
        </h1>

        <div className="bg-white rounded-2xl shadow p-5 mb-8">
          <input
            type="text"
            placeholder="Search orders by customer email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <p className="text-sm text-gray-500 mt-3">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center">
            No orders found.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow p-6"
              >
                <div className="flex justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Order #{order.id}
                    </h2>

                    <p className="text-gray-500">{order.user_email}</p>

                    <p className="text-gray-600">
                      {order.customer_name} • {order.phone}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Order Status
                    </label>

                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value)
                      }
                      className={`${getStatusClass(
                        order.status
                      )} border p-3 rounded-xl font-semibold outline-none disabled:opacity-60`}
                    >
                      {orderStatuses.map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="bg-white text-gray-800"
                        >
                          {status}
                        </option>
                      ))}
                    </select>

                    {updatingId === order.id && (
                      <p className="text-xs text-gray-500 mt-2">
                        Updating...
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {orderStatuses.map((status) => {
                    const active = order.status === status;

                    return (
                      <span
                        key={status}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          active
                            ? getStatusClass(status)
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {status}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-5 space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b pb-2"
                    >
                      <span>
                        {item.food_name} × {item.quantity}
                      </span>

                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-between text-xl font-bold text-orange-600">
                  <span>Total</span>
                  <span>₹{order.grand_total}</span>
                </div>

                <div className="mt-5 bg-orange-50 p-4 rounded-xl">
                  <b>Address:</b>

                  <p>
                    {order.address}, {order.city} - {order.pincode}
                  </p>

                  <p className="mt-1">
                    Payment: {order.payment_method}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;