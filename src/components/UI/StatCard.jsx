// src/components/UI/StatCard.jsx
export default function StatCard({ title, value, icon, bgColor }) {
  return (
    <div className={`p-4 rounded-xl shadow-sm text-white ${bgColor}`}>
      <div className="text-sm">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-2">{icon}</div>
    </div>
  );
}
