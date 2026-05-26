import { History, ReceiptText, ShoppingCart, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { StatCard } from "../../components/ui/StatCard";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useProducts } from "../../hooks/useInventory";
import { useRecordSale, useSales } from "../../hooks/useSales";
import { formatDateTime } from "../../lib/dates";
import { currency } from "../../lib/utils";
import type { SaleFormValues } from "../../types";
import { SaleForm } from "./SaleForm";

export function SalesPage() {
  const { data: products = [] } = useProducts();
  const { data: sales = [] } = useSales();
  const { summary } = useAnalytics();
  const recordSale = useRecordSale();
  const [error, setError] = useState("");

  async function handleSale(values: SaleFormValues) {
    try {
      setError("");
      await recordSale.mutateAsync(values);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to record sale");
    }
  }

  return (
    <div className="grid gap-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black">Sales</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Recording a sale automatically reduces stock.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Sales entries" value={String(sales.length)} detail="All time" icon={<ReceiptText className="h-5 w-5" />} />
        <StatCard title="Quantity sold" value={String(summary.totalQuantitySold)} detail="Across products" icon={<ShoppingCart className="h-5 w-5" />} tone="blue" />
        <StatCard title="Revenue" value={currency(summary.totalRevenue)} detail="All recorded sales" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Profit" value={currency(summary.totalProfit)} detail="Sale price minus buying price" icon={<TrendingUp className="h-5 w-5" />} tone="amber" />
      </section>

      <SaleForm products={products} isSubmitting={recordSale.isPending} onSubmit={handleSale} />
      {error ? <div className="rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-100">{error}</div> : null}

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-200 p-4 dark:border-slate-800">
          <History className="h-5 w-5 text-slate-500" />
          <h2 className="font-bold">Sales history</h2>
        </div>
        {sales.length === 0 ? (
          <div className="p-4">
            <EmptyState title="No sales yet" description="Record a sale to start building history and analytics." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Profit</th>
                  <th className="px-4 py-3">Employee</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDateTime(sale.soldAt)}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{sale.productName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{sale.sku}</p>
                    </td>
                    <td className="px-4 py-3">{sale.quantitySold}</td>
                    <td className="px-4 py-3 font-semibold">{currency(sale.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={sale.profit >= 0 ? "success" : "danger"}>{currency(sale.profit)}</Badge>
                    </td>
                    <td className="px-4 py-3">{sale.employeeName || "Owner"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
