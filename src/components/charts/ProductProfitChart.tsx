import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { currency } from "../../lib/utils";
import type { ProductProfitRow } from "../../types";

const colors = ["#0f766e", "#0891b2", "#f59e0b", "#dc2626", "#7c3aed", "#475569"];

export function ProductProfitChart({ data }: { data: ProductProfitRow[] }) {
  return (
    <div className="h-72 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-950 dark:text-white">Product-wise profit</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Top contributors</p>
      </div>
      <ResponsiveContainer width="100%" height="72%">
        <PieChart>
          <Pie data={data.slice(0, 6)} dataKey="profit" nameKey="productName" innerRadius={48} outerRadius={84} paddingAngle={3}>
            {data.slice(0, 6).map((row, index) => (
              <Cell key={row.productId} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => currency(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
