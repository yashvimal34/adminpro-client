import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
  });
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch overall stats
        const statsRes = await axios.get("https://adminpro-server-n5dp.onrender.com/api/users/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsRes.data);

        // Fetch trend data
        const trendRes = await axios.get("https://adminpro-server-n5dp.onrender.com/api/users/trend", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrend(trendRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, []);

  const cards = [
    { title: "Total Users", value: stats.total, color: "bg-blue-500", icon: "👥" },
    { title: "Active Users", value: stats.active, color: "bg-green-500", icon: "✅" },
    { title: "Inactive Users", value: stats.inactive, color: "bg-yellow-500", icon: "⏸️" },
    { title: "Pending Users", value: stats.pending, color: "bg-red-500", icon: "⏳" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.color} text-white rounded-xl p-5 shadow-lg flex items-center`}
          >
            <div className="text-3xl mr-4">{card.icon}</div>
            <div>
              <h3 className="text-sm">{card.title}</h3>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-xl p-5 shadow">
        <h3 className="text-lg font-semibold mb-4">User Registrations Over Time</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="active" stroke="#22c55e" name="Active" />
              <Line type="monotone" dataKey="inactive" stroke="#eab308" name="Inactive" />
              <Line type="monotone" dataKey="pending" stroke="#ef4444" name="Pending" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
