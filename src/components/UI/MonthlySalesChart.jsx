import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { name: "Jan", value: 52 },
  { name: "Feb", value: 58 },
  { name: "Mar", value: 90 },
  { name: "Apr", value: 112 },
  { name: "May", value: 70 },
  { name: "Jun", value: 106 },
  { name: "Jul", value: 88 },
  { name: "Aug", value: 50 },
  { name: "Sep", value: 105 },
  { name: "Oct", value: 160 },
  { name: "Nov", value: 180 },
  { name: "Dec", value: 150 },
  { name: "Apr", value: 135 },
];


export default function MonthlySalesChart() {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <h2 className="text-xl font-semibold mb-4">Sales Chart</h2>
      
      <div className="w-full h-64"> {/* Make sure height is set for chart container */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
