export default function StatsCard({ title, value, subtitle, icon, iconBg }) {
  return (
    <div className="bg-black rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <div className={`${iconBg} p-3 rounded-lg`}>
            {icon}
          </div>
        )}
        <div className="text-gray-400 text-sm">{title}</div>
      </div>
      <div className="text-white text-4xl font-bold mb-2">{value}</div>
      <div className="text-teal-500 text-sm">{subtitle}</div>
    </div>
  );
}
