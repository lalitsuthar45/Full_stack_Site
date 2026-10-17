import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  UtensilsCrossed,
  Copy,
  Check,
  ShieldCheck,
  KeyRound,
  X,
} from "lucide-react";
import { getAuthHeaders, getAuthUser } from "./authStorage";
import { useToast } from "./Toast";
import OrderSuccessModal from "./OrderSuccessModal";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartPageProps = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

type PaymentMethod = "COD" | "UPI" | "CARD";

function CartPage({ cartItems, setCartItems }: CartPageProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("COD");

  const [upiId, setUpiId] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [loading, setLoading] = useState(false);

  // Order success modal state
  const [successModal, setSuccessModal] = useState<{
    show: boolean;
    orderId: number | string;
    grandTotal: number;
    paymentMethod: string;
  }>({ show: false, orderId: "", grandTotal: 0, paymentMethod: "" });

  // OTP Center Modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // =========================
  // CART TOTAL
  // =========================

  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const gst = Math.round(itemsTotal * 0.05);

  const deliveryCharge =
    itemsTotal > 499 || itemsTotal === 0 ? 0 : 40;

  const discount = itemsTotal > 999 ? 100 : 0;

  const grandTotal =
    itemsTotal + gst + deliveryCharge - discount;

  // =========================
  // API URL
  // =========================

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
  // FastAPI "Not authenticated" bhej deta hai.
  // =========================
  // =========================
  // REMOVE ITEM
  // =========================

  const removeItem = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // =========================
  // CARD NUMBER
  // =========================

  const handleCardNumberChange = (value: string) => {
    const digitsOnly = value
      .replace(/\D/g, "")
      .slice(0, 16);

    const formatted = digitsOnly
      .replace(/(.{4})/g, "$1 ")
      .trim();

    setCardNumber(formatted);
  };

  // =========================
  // EXPIRY
  // =========================

  const handleExpiryChange = (value: string) => {
    const digitsOnly = value
      .replace(/\D/g, "")
      .slice(0, 4);

    if (digitsOnly.length >= 3) {
      setExpiry(
        `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
      );
    } else {
      setExpiry(digitsOnly);
    }
  };

  // =========================
  // UPI VALIDATION
  // =========================

  const isValidUpi = (value: string) => {
    return /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(value);
  };

  // =========================
  // SEND OTP
  // =========================

  const handleSendOtp = () => {
    if (!mobile || mobile.length < 10) {
      toast.warning("Please enter valid mobile number");
      return;
    }

    const randomOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    setGeneratedOtp(randomOtp);
    setOtpVerified(false);
    setShowOtpModal(true);
    setCopiedOtp(false);
  };

  const copyOtpToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedOtp);
      setCopiedOtp(true);
      toast.success("OTP copied to clipboard!");
      setTimeout(() => setCopiedOtp(false), 2500);
    } catch {
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2500);
    }
  };

  const autoFillOtp = () => {
    setOtp(generatedOtp);
    setOtpVerified(true);
    setShowOtpModal(false);
    toast.success("OTP auto-filled and verified! ✅");
  };

  // =========================
  // VERIFY OTP
  // =========================

  const handleVerifyOtp = () => {
    if (!generatedOtp) {
      toast.warning("Please send OTP first");
      return;
    }

    if (otp === generatedOtp) {
      setOtpVerified(true);
      toast.success("OTP verified successfully ✅");
    } else {
      setOtpVerified(false);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  // =========================
  // PAYMENT VALIDATION
  // =========================

  const validatePayment = () => {
    if (paymentMethod === "COD") {
      return true;
    }

    if (paymentMethod === "UPI") {
      if (!upiId) {
        toast.warning("Please enter UPI ID");
        return false;
      }

      if (!isValidUpi(upiId)) {
        toast.warning(
          "Please enter valid UPI ID. Example: lalit@okaxis"
        );
        return false;
      }

      return true;
    }

    if (paymentMethod === "CARD") {
      const cleanCard = cardNumber.replace(/\s/g, "");

      if (!cleanCard || cleanCard.length !== 16) {
        toast.warning("Please enter valid 16 digit card number");
        return false;
      }

      if (!cardHolder) {
        toast.warning("Please enter card holder name");
        return false;
      }

      if (!expiry || expiry.length !== 5) {
        toast.warning("Please enter valid expiry date MM/YY");
        return false;
      }

      if (!cvv || cvv.length < 3) {
        toast.warning("Please enter valid CVV");
        return false;
      }

      return true;
    }

    return false;
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.warning("Cart is empty");
      return;
    }

    if (
      !fullName ||
      !address ||
      !city ||
      !pincode ||
      !mobile
    ) {
      toast.warning("Please fill all delivery details");
      return;
    }

    if (!otpVerified) {
      toast.warning("Please verify OTP first");
      return;
    }

    if (!validatePayment()) {
      return;
    }

    const user = getAuthUser();

    if (!user.email) {
      toast.error("User not found. Please login again.");
      return;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, "");

    const orderData = {
      user_email: user.email,
      customer_name: fullName,
      phone: mobile,
      address,
      city,
      pincode,

      payment_method:
        paymentMethod === "COD"
          ? "Cash on Delivery"
          : paymentMethod === "UPI"
          ? `UPI - ${upiId}`
          : `Card - ****${cleanCardNumber.slice(-4)}`,

      items_total: itemsTotal,
      gst,
      delivery_charge: deliveryCharge,
      discount,
      grand_total: grandTotal,

      items: cartItems.map((item) => ({
        food_name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
    };

    setLoading(true);

    try {
      const response = await fetch(
        `${getApiUrl()}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Order failed");
        return;
      }

      // Show beautiful success modal
      setSuccessModal({
        show: true,
        orderId: data.order_id,
        grandTotal: data.grand_total,
        paymentMethod: orderData.payment_method,
      });

      // Clear cart after successful order
      setCartItems([]);

      // Reset delivery/payment fields
      setFullName("");
      setAddress("");
      setCity("");
      setPincode("");
      setMobile("");
      setOtp("");
      setGeneratedOtp("");
      setOtpVerified(false);
      setUpiId("");
      setCardNumber("");
      setCardHolder("");
      setExpiry("");
      setCvv("");
      setPaymentMethod("COD");
    } catch {
      toast.error("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 pt-24 px-4 pb-12">

      {/* Order Success Modal */}
      {successModal.show && (
        <OrderSuccessModal
          orderId={successModal.orderId}
          grandTotal={successModal.grandTotal}
          paymentMethod={successModal.paymentMethod}
          onClose={() => setSuccessModal((s) => ({ ...s, show: false }))}
        />
      )}

      {/* Demo OTP Center Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="
              relative w-full max-w-sm sm:max-w-md
              bg-white dark:bg-slate-900
              rounded-3xl shadow-2xl
              p-6 sm:p-8
              border border-orange-100 dark:border-slate-800
              text-center
              animate-slide-in
            "
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition p-1"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <ShieldCheck size={36} />
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
              Verification Code
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
              Use this demo OTP to verify delivery to <span className="font-semibold text-gray-800 dark:text-gray-200">+91 {mobile}</span>
            </p>

            {/* Big OTP Display */}
            <div className="bg-orange-50/80 dark:bg-slate-800/80 border-2 border-dashed border-orange-300 dark:border-orange-500/40 rounded-2xl p-4 mb-6">
              <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 tracking-wider uppercase mb-1">
                Your One-Time Password
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-[0.35em] pl-[0.35em]">
                {generatedOtp}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={copyOtpToClipboard}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-orange-500 text-orange-600 dark:text-orange-400 font-bold text-sm hover:bg-orange-50 dark:hover:bg-slate-800 transition active:scale-95"
              >
                {copiedOtp ? (
                  <>
                    <Check size={18} className="text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy OTP
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={autoFillOtp}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:from-orange-700 hover:to-red-600 transition active:scale-95"
              >
                <KeyRound size={18} />
                Auto-Fill & Verify
              </button>
            </div>

            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-4">
              Demo OTP simulation • No SMS charges applied
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">

        {/* =========================
            TITLE
        ========================= */}

        <h1 className="text-4xl font-bold text-orange-600 mb-8">
          Your Cart
        </h1>

        {/* =========================
            EMPTY CART
        ========================= */}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 sm:p-14 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-6">
              <ShoppingBag size={38} />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              Looks like you haven't added anything yet. Browse our full
              menu and find something delicious.
            </p>

            <button
              type="button"
              onClick={() => navigate("/fullmenu")}
              className="mt-7 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white px-7 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 transition-all"
            >
              <UtensilsCrossed size={19} />
              Browse Full Menu
            </button>

          </div>
        ) : (
          <>
            {/* =========================
                CART + BILL
            ========================= */}

            <div className="grid lg:grid-cols-3 gap-8">

              {/* CART ITEMS */}

              <div className="lg:col-span-2 space-y-5">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-md p-5"
                  >

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-5">

                      {/* FOOD INFO */}

                      <div className="flex gap-4 min-w-0">

                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                          />
                        )}

                        <div className="min-w-0">

                          <h2 className="text-xl font-bold text-gray-800 truncate">
                            {item.name}
                          </h2>

                          <p className="text-gray-500 mt-1">
                            ₹{item.price} × {item.quantity}
                          </p>

                          <p className="text-orange-600 font-semibold mt-1">
                            Subtotal: ₹
                            {item.price * item.quantity}
                          </p>

                        </div>

                      </div>

                      {/* PRICE + CONTROLS */}

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-3">

                        <div className="text-2xl font-bold text-gray-800">
                          ₹{item.price * item.quantity}
                        </div>

                        {/* QUANTITY */}

                        <div className="flex items-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
                          >
                            <Minus size={18} />
                          </button>

                          <span className="min-w-8 text-center font-bold text-gray-800">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
                          >
                            <Plus size={18} />
                          </button>

                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.id)
                          }
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition font-semibold"
                        >
                          <Trash2 size={17} />
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

              {/* =========================
                  BILL SUMMARY
              ========================= */}

              <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">

                <h2 className="text-2xl font-bold text-gray-800 mb-5">
                  Bill Summary
                </h2>

                <div className="space-y-3 text-gray-700">

                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span>₹{itemsTotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{gst}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>
                      {deliveryCharge === 0
                        ? "Free"
                        : `₹${deliveryCharge}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>

                  <hr />

                  <div className="flex justify-between text-xl font-bold text-orange-600">
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
                  </div>

                </div>

              </div>

            </div>

            {/* =========================
                DELIVERY & PAYMENT
            ========================= */}

            <div className="mt-10 bg-white p-8 rounded-2xl shadow-xl">

              <h2 className="text-2xl font-bold mb-6 text-orange-600">
                Delivery & Payment Details
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                {/* NAME */}

                <input
                  type="text"
                  placeholder="Full Name"
                  className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                />

                {/* MOBILE */}

                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value)
                  }
                />

                {/* CITY */}

                <input
                  type="text"
                  placeholder="City"
                  className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                />

                {/* PINCODE */}

                <input
                  type="text"
                  placeholder="Pincode"
                  className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value)
                  }
                />

                {/* ADDRESS */}

                <textarea
                  placeholder="Full Address"
                  className="md:col-span-2 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                />

                {/* OTP */}

                <div className="md:col-span-2 flex flex-col md:flex-row gap-3">

                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="flex-1 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
                  >
                    Send OTP
                  </button>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700"
                  >
                    Verify OTP
                  </button>

                </div>

                {otpVerified && (
                  <p className="md:col-span-2 text-green-600 font-semibold">
                    OTP verified successfully ✅
                  </p>
                )}

                {/* PAYMENT METHOD */}

                <div className="md:col-span-2">

                  <label className="font-semibold text-gray-700 text-lg">
                    Payment Method
                  </label>

                  <div className="grid md:grid-cols-3 gap-4 mt-3">

                    {["COD", "UPI", "CARD"].map(
                      (method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() =>
                            setPaymentMethod(
                              method as PaymentMethod
                            )
                          }
                          className={`p-4 rounded-xl border font-semibold transition-all ${
                            paymentMethod === method
                              ? "bg-orange-600 text-white border-orange-600 shadow-lg"
                              : "bg-white text-gray-700 border-gray-300 hover:border-orange-500"
                          }`}
                        >
                          {method === "COD"
                            ? "Cash on Delivery"
                            : method === "UPI"
                            ? "UPI Payment"
                            : "Debit / Credit Card"}
                        </button>
                      )
                    )}

                  </div>

                </div>

                {/* UPI */}

                {paymentMethod === "UPI" && (
                  <div className="md:col-span-2 bg-green-50 border border-green-300 rounded-xl p-5">

                    <h3 className="font-bold text-lg text-green-700 mb-4">
                      UPI Payment
                    </h3>

                    <input
                      type="text"
                      placeholder="Enter UPI ID (example@okaxis)"
                      value={upiId}
                      onChange={(e) =>
                        setUpiId(e.target.value)
                      }
                      className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <p className="text-sm text-gray-500 mt-2">
                      Example: lalit@okaxis, abc@ybl,
                      user@ibl
                    </p>

                  </div>
                )}

                {/* CARD */}

                {paymentMethod === "CARD" && (
                  <div className="md:col-span-2 bg-blue-50 border border-blue-300 rounded-xl p-5">

                    <h3 className="font-bold text-lg text-blue-700 mb-4">
                      Debit / Credit Card
                    </h3>

                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardNumber}
                      onChange={(e) =>
                        handleCardNumberChange(
                          e.target.value
                        )
                      }
                      className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="text"
                      placeholder="Card Holder Name"
                      value={cardHolder}
                      onChange={(e) =>
                        setCardHolder(e.target.value)
                      }
                      className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="grid grid-cols-2 gap-4">

                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) =>
                          handleExpiryChange(
                            e.target.value
                          )
                        }
                        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <input
                        type="password"
                        maxLength={3}
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(
                            e.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                        }
                        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                  </div>
                )}

                {/* PLACE ORDER */}

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="md:col-span-2 w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl text-lg font-bold transition disabled:opacity-60"
                >
                  {loading
                    ? "Processing Payment..."
                    : paymentMethod === "COD"
                    ? `Place Order ₹${grandTotal}`
                    : `Pay ₹${grandTotal}`}
                </button>

                {/* COD INFO */}

                {paymentMethod === "COD" && (
                  <div className="md:col-span-2 bg-yellow-50 border border-yellow-300 rounded-xl p-4">

                    <h3 className="font-bold text-yellow-700">
                      Cash On Delivery
                    </h3>

                    <p className="text-gray-600 mt-2">
                      You will pay <b>₹{grandTotal}</b>{" "}
                      when your order is delivered.
                    </p>

                  </div>
                )}

                {/* UPI INFO */}

                {paymentMethod === "UPI" && (
                  <div className="md:col-span-2 bg-green-50 border border-green-300 rounded-xl p-4">

                    <h3 className="font-bold text-green-700">
                      UPI Payment
                    </h3>

                    <p className="text-gray-600 mt-2">
                      Your payment will be processed
                      securely through your UPI
                      application.
                    </p>

                  </div>
                )}

                {/* CARD INFO */}

                {paymentMethod === "CARD" && (
                  <div className="md:col-span-2 bg-blue-50 border border-blue-300 rounded-xl p-4">

                    <h3 className="font-bold text-blue-700">
                      Secure Card Payment
                    </h3>

                    <p className="text-gray-600 mt-2">
                      Your card details are encrypted.
                      Only the last 4 digits are stored
                      with the order for reference.
                    </p>

                  </div>
                )}

              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default CartPage;