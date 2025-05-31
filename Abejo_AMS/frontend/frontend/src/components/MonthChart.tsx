// src/components/MonthChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', appointments: 20 },
  { month: 'Feb', appointments: 35 },
  { month: 'Mar', appointments: 45 },
  { month: 'Apr', appointments: 32 },
  { month: 'May', appointments: 50 },
  { month: 'Jun', appointments: 40 },
  // add more months if needed
];

function MonthChart() {
  return (
    <ResponsiveContainer width="80%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="4 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="appointments" fill="#4b5563" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthChart;
