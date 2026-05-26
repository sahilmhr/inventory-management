import { Download, FileSpreadsheet, FileText, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { StatCard } from "../../components/ui/StatCard";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useProducts } from "../../hooks/useInventory";
import { useSales } from "../../hooks/useSales";
import { toDateInputValue, formatDateTime } from "../../lib/dates";
import { exportInventoryCsv, exportProfitPdf, exportSalesCsv, exportSalesExcel } from "../../lib/export";
import { currency } from "../../lib/utils";
import type { ReportFilters } from "../../types";

export function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    period: "month",
    startDate: toDateInputValue(new Date()),
    endDate: toDateInputValue(new Date())
  });
  const { data: products = [] } = useProducts();
  const { data: sales = [] } = useSales(filters);
  const { data: allSales = [] } = useSales();
  const { summary } = useAnalytics(filters);
  const employees = useMemo(() => Array.from(new Set(allSales.map((sale) => sale.employeeName).filter(Boolean))) as string[], [allSales]);

  return (
    <div className="grid gap-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black">Reports</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Filter sales, profit, and inventory exports.</p>
      </div>

      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-6">
        <Select label="Period" value={filters.period} onChange={(event) => setFilters((value) => ({ ...value, period: event.target.value as ReportFilters["period"] }))}>
          <option value="day">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="custom">Custom</option>
          <option value="all">All time</option>
        </Select>
        <Input label="Start" type="date" value={filters.startDate ?? ""} onChange={(event) => setFilters((value) => ({ ...value, startDate: event.target.value, period: "custom" }))} />
        <Input label="End" type="date" value={filters.endDate ?? ""} onChange={(event) => setFilters((value) => ({ ...value, endDate: event.target.value, period: "custom" }))} />
        <Select label="Product" value={filters.productId ?? ""} onChange={(event) => setFilters((value) => ({ ...value, productId: event.target.value || undefined }))}>
          <option value="">All products</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </Select>
        <Select label="Employee" value={filters.employeeName ?? ""} onChange={(event) => setFilters((value) => ({ ...value, employeeName: event.target.value || undefined }))}>
          <option value="">All employees</option>
          {employees.map((employee) => (
            <option key={employee} value={employee}>
              {employee}
            </option>
          ))}
        </Select>
        <div className="flex items-end">
          <Button variant="secondary" className="w-full" icon={<Filter className="h-4 w-4" />} onClick={() => setFilters({ period: "all" })}>
            Clear
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Report revenue" value={currency(summary.totalRevenue)} detail={`${sales.length} sales`} icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Report profit" value={currency(summary.totalProfit)} detail={`Range profit ${currency(summary.customRangeProfit)}`} icon={<FileText className="h-5 w-5" />} tone="blue" />
        <StatCard title="Products sold" value={String(summary.productWiseProfit.length)} detail="Unique products" icon={<FileText className="h-5 w-5" />} tone="amber" />
        <StatCard title="Inventory value" value={currency(summary.inventoryValue)} detail="Current stock value" icon={<FileText className="h-5 w-5" />} tone="slate" />
      </section>

      <section className="flex flex-wrap gap-2">
        <Button variant="secondary" icon={<Download className="h-4 w-4" />} onClick={() => exportSalesCsv(sales)}>
          Sales CSV
        </Button>
        <Button variant="secondary" icon={<FileSpreadsheet className="h-4 w-4" />} onClick={() => exportSalesExcel(sales)}>
          Excel CSV
        </Button>
        <Button variant="secondary" icon={<FileText className="h-4 w-4" />} onClick={() => exportProfitPdf(summary, sales)}>
          Profit PDF
        </Button>
        <Button variant="secondary" icon={<Download className="h-4 w-4" />} onClick={() => exportInventoryCsv(products)}>
          Inventory CSV
        </Button>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="font-bold">Sales report</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Profit</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDateTime(sale.soldAt)}</td>
                    <td className="px-4 py-3 font-semibold">{sale.productName}</td>
                    <td className="px-4 py-3">{sale.quantitySold}</td>
                    <td className="px-4 py-3">{currency(sale.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={sale.profit >= 0 ? "success" : "danger"}>{currency(sale.profit)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="font-bold">Product profit</h2>
          </div>
          <div className="grid gap-3 p-4">
            {summary.productWiseProfit.map((row) => (
              <div key={row.productId} className="rounded-md border border-slate-100 p-3 dark:border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{row.productName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{row.quantitySold} sold · {currency(row.revenue)} revenue</p>
                  </div>
                  <Badge tone="success">{currency(row.profit)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
