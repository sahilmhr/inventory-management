import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { currency } from "../../lib/utils";

export function ProfitTrendChart({ data }: { data: Array<{ label: string; profit: number; revenue: number }> }) {
  return (
    <div className="h-72 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-950 dark:text-white">Profit trend</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Last 7 days</p>
      </div>
      <ResponsiveContainer width="100%" height="78%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.38} />
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickFormatter={(value) => currency(Number(value)).replace("₹", "₹ ")} tickLine={false} axisLine={false} fontSize={12} width={78} />
          <Tooltip formatter={(value) => currency(Number(value))} />
          <Area type="monotone" dataKey="profit" stroke="#0f766e" strokeWidth={3} fill="url(#profitGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
