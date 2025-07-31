import { useEffect, useState } from "react";
import axios from "axios";
import OrderDetailsModal from "../components/UI/OrderDetailsModal"; // adjust path

// Helper for status badge styles
const getStatusClasses = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-700 border-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "failed":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

export default function ReportsPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null); // for modal

  // Fetch orders with pagination
  const fetchOrders = async (pageNum = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/orders?page=${pageNum}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(res.data)) {
        setOrders(res.data);
        setTotalPages(1);
      } else {
        setOrders(res.data.orders || []);
        setTotalPages(res.data.totalPages || 1);
      }

      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setOrders([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  // Filter orders based on selected status
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter(
          (order) =>
            order.paymentStatus?.toLowerCase() === statusFilter.toLowerCase()
        );

  // Export filtered orders to CSV
  const exportToCSV = () => {
    if (!filteredOrders.length) {
      alert("No data to export");
      return;
    }

    const headers = ["Customer", "Items", "Total Amount", "Status", "Date"];

    const rows = filteredOrders.map((order) => {
      const customer = order.user?.name || order.user?.email || "Unknown";
      const items = order.items
        .map((i) => `${i.name} (x${i.quantity})`)
        .join(" | ");
      const total = order.totalAmount;
      const status = order.paymentStatus;
      const date = new Date(order.createdAt).toLocaleDateString();
      return [customer, items, total, status, date];
    });

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "orders_report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4">
      {/* Header with filter and export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-xl font-bold">Order Reports</h2>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <button
            onClick={exportToCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-gray-500 text-center">No orders found</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[700px] w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="p-2 border">Customer Name</th>
                  <th className="p-2 border">Items</th>
                  <th className="p-2 border">Total Amount</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="text-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-2 border whitespace-nowrap">
                      {order.user?.name || order.user?.email || "Unknown"}
                    </td>
                    <td className="p-2 border">
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.name} (x{item.quantity}) – ₹{item.price}
                        </div>
                      ))}
                    </td>
                    <td className="p-2 border whitespace-nowrap">
                      ₹{order.totalAmount}
                    </td>
                    <td className="p-2 border whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full border text-xs capitalize ${getStatusClasses(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-2 border whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedOrder(order)}
              >
                <p className="font-semibold">
                  {order.user?.name || order.user?.email || "Unknown"}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="mb-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm">
                      {item.name} (x{item.quantity}) – ₹{item.price}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">₹{order.totalAmount}</span>
                  <span
                    className={`px-2 py-1 rounded-full border text-xs capitalize ${getStatusClasses(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => fetchOrders(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => fetchOrders(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        getStatusClasses={getStatusClasses}
      />
    </div>
  );
}
