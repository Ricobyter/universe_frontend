import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UserGrowthChart({ data }) {
  return (
    <div className="bg-black rounded-xl p-6 border border-gray-800">
      <div className="mb-4">
        <h2 className="text-white text-xl font-semibold">User Growth</h2>
        <p className="text-gray-400 text-sm">Last 7 months</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis 
            dataKey="month" 
            stroke="#6B7280"
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            stroke="#6B7280"
            tick={{ fill: '#6B7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#000000', 
              border: '1px solid #1F2937',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Bar 
            dataKey="users" 
            fill="#14B8A6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
