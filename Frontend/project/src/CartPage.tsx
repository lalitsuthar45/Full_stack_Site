// src/components/CartPage.tsx
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartPageProps {
  cartItems: CartItem[];
}

export default function CartPage({ cartItems }: CartPageProps) {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty 😔</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded shadow">
              <div>
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-gray-600">₹{item.price} × {item.quantity}</p>
              </div>
              <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
            </div>
          ))}

          <div className="text-right text-2xl font-bold mt-6">
            Total: ₹{total}
          </div>
        </div>
      )}
    </div>
  );
}