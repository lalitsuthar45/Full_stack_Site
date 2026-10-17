import { useState } from "react";
import { User, Mail, LogOut, Edit, Save, X, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./Toast";

type StoredUser = {
  id?: number;
  name?: string;
  email?: string;
};

function Profile() {
  const navigate = useNavigate();
  const toast = useToast();

  const savedUser: StoredUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(savedUser.name || "");
  const [email, setEmail] = useState(savedUser.email || "");
  const [loading, setLoading] = useState(false);

  const getApiUrl = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://10.201.230.252:8000";
  }

  return import.meta.env.VITE_API_URL;
};

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    if (!name || !email) {
      toast.warning("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_email: savedUser.email,
          name,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Profile update failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(data.message || "Profile updated successfully");
      setIsEditing(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 pt-28 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-orange-600 text-white flex items-center justify-center mb-4">
            <User size={48} />
          </div>

          {!isEditing ? (
            <>
              <h1 className="text-3xl font-bold text-gray-800">
                {savedUser.name || "User"}
              </h1>

              <p className="flex items-center gap-2 text-gray-600 mt-2">
                <Mail size={18} />
                {savedUser.email || "No email found"}
              </p>
            </>
          ) : (
            <div className="w-full max-w-md mt-4">
              <input
                type="text"
                value={name}
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-orange-500"
              />

              <input
                type="email"
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div
            onClick={() => navigate("/orders")}
            className="bg-orange-50 p-5 rounded-2xl cursor-pointer hover:bg-orange-100 transition border border-orange-100"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-orange-600" size={28} />
              <div>
                <h3 className="font-bold text-orange-700">My Orders</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your food order history
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
            <h3 className="font-bold text-orange-700">Account</h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage your profile details
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-700"
            >
              <Edit size={20} />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-60"
              >
                <Save size={20} />
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setName(savedUser.name || "");
                  setEmail(savedUser.email || "");
                }}
                className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-700"
              >
                <X size={20} />
                Cancel
              </button>
            </>
          )}

          <button
            onClick={logout}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-700"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;