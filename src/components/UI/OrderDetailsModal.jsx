export default function OrderDetailsModal({ order, onClose, getStatusClasses }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-4">Order Details</h3>

        <p className="mb-2">
          <strong>Customer:</strong>{" "}
          {order.user?.name || order.user?.email || "Unknown"}
        </p>
        <p className="mb-2">
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
        <p className="mb-2">
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded-full border text-xs capitalize ${getStatusClasses(
              order.paymentStatus
            )}`}
          >
            {order.paymentStatus}
          </span>
        </p>
        <p className="mb-2">
          <strong>Total Amount:</strong> ₹{order.totalAmount}
        </p>

        <h4 className="font-semibold mt-4 mb-2">Items</h4>
        <ul className="list-disc pl-5 space-y-1">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.name} (x{item.quantity}) – ₹{item.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
