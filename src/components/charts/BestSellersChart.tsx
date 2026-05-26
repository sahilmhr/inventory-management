import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProductProfitRow } from "../../types";

export function BestSellersChart({ data }: { data: ProductProfitRow[] }) {
  return (
    <div className="h-72 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-950 dark:text-white">Best sellers</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">By quantity sold</p>
      </div>
      <ResponsiveContainer width="100%" height="78%">
        <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis dataKey="productName" type="category" width={120} tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip />
          <Bar dataKey="quantitySold" fill="#0891b2" radius={[0, 5, 5, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
