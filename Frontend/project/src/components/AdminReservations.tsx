import { useEffect, useState } from "react";
import { getAuthHeaders } from "./authStorage";
import { useToast } from "./Toast";

type Reservation = {
  id: number;
  user_email: string;
  name: string;
  phone: string;
  guests: number;
  reservation_date: string;
  reservation_time: string;
  occasion: string;
  table_type: string;
  special_request: string;
  status: string;
};

const statuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

function AdminReservations() {
  const toast = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");

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
  const fetchReservations = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/admin/reservations`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Unable to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateStatus = async (reservationId: number, status: string) => {
    try {
      const response = await fetch(
        `${getApiUrl()}/admin/reservations/${reservationId}/status?status=${encodeURIComponent(
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

      setReservations((prev) =>
        prev.map((item) =>
          item.id === reservationId ? { ...item, status } : item
        )
      );
      toast.success(`Reservation #${reservationId} status updated to ${status}`);
    } catch {
      toast.error("Unable to connect to server");
    }
  };

  const filteredReservations = reservations.filter((reservation) =>
    reservation.user_email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 pt-28 text-center text-xl font-semibold">
        Loading reservations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 pt-28 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">
          Admin Reservations
        </h1>

        <div className="bg-white rounded-2xl shadow p-5 mb-8">
          <input
            type="text"
            placeholder="Search reservations by customer email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <p className="text-sm text-gray-500 mt-3">
            Showing {filteredReservations.length} of {reservations.length} reservations
          </p>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center">
            No reservations found.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-2xl shadow p-6"
              >
                <div className="flex justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Reservation #{reservation.id}
                    </h2>
                    <p className="text-gray-500">{reservation.user_email}</p>
                    <p className="text-gray-600">
                      {reservation.name} • {reservation.phone}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Status
                    </label>
                    <select
                      value={reservation.status}
                      onChange={(e) =>
                        updateStatus(reservation.id, e.target.value)
                      }
                      className="border p-3 rounded-xl"
                    >
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-5 text-gray-700">
                  <div>
                    <b>Date</b>
                    <p>{reservation.reservation_date}</p>
                  </div>

                  <div>
                    <b>Time</b>
                    <p>{reservation.reservation_time}</p>
                  </div>

                  <div>
                    <b>Guests</b>
                    <p>{reservation.guests}</p>
                  </div>

                  <div>
                    <b>Occasion</b>
                    <p>{reservation.occasion}</p>
                  </div>

                  <div>
                    <b>Table Type</b>
                    <p>{reservation.table_type}</p>
                  </div>
                </div>

                {reservation.special_request && (
                  <div className="mt-5 bg-orange-50 rounded-xl p-4">
                    <b>Special Request</b>
                    <p className="mt-2 text-gray-700">
                      {reservation.special_request}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReservations;