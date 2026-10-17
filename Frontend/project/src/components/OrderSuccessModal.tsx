import { CheckCircle2, ShoppingBag, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// =========================================================
// ORDER SUCCESS MODAL
// =========================================================

type OrderSuccessModalProps = {
  orderId: number | string;
  grandTotal: number;
  paymentMethod: string;
  onClose: () => void;
};

export default function OrderSuccessModal({
  orderId,
  grandTotal,
  paymentMethod,
  onClose,
}: OrderSuccessModalProps) {
  const navigate = useNavigate();

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">

      {/* Card */}
      <div
        className="
          relative w-full max-w-sm sm:max-w-md
          bg-white dark:bg-slate-900
          rounded-3xl shadow-2xl
          p-6 sm:p-8
          animate-slide-in
          text-center
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
        >
          <X size={20} />
        </button>

        {/* Big animated check */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shadow-md">
            <CheckCircle2
              size={48}
              className="text-green-500 dark:text-green-400"
              strokeWidth={1.8}
            />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
          Order Placed! 🎉
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Your food is being prepared with love.
        </p>

        {/* Order Details */}
        <div className="bg-orange-50 dark:bg-slate-800/60 rounded-2xl p-4 space-y-2 text-left mb-6 border border-orange-100 dark:border-slate-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Order ID</span>
            <span className="font-bold text-gray-800 dark:text-white">#{orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Total Amount</span>
            <span className="font-bold text-orange-600 dark:text-orange-400 text-base">
              ₹{grandTotal}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Payment</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200 text-right max-w-[55%] truncate">
              {paymentMethod}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Status</span>
            <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Confirmed
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              navigate("/orders");
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
              bg-gradient-to-r from-orange-600 to-red-500
              text-white font-bold text-sm
              shadow-lg shadow-orange-500/25
              hover:from-orange-700 hover:to-red-600
              hover:-translate-y-0.5 transition-all"
          >
            <ShoppingBag size={17} />
            View My Orders
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/home");
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
              bg-gray-100 dark:bg-slate-800
              text-gray-800 dark:text-white font-bold text-sm
              border border-gray-200 dark:border-slate-700
              hover:border-orange-400 hover:text-orange-600
              hover:-translate-y-0.5 transition-all"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
