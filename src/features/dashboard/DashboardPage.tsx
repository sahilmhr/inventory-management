import { AlertTriangle, Boxes, IndianRupee, PackageX, ShoppingBag, TrendingUp } from "lucide-react";
import { BestSellersChart } from "../../components/charts/BestSellersChart";
import { ProductProfitChart } from "../../components/charts/ProductProfitChart";
import { ProfitTrendChart } from "../../components/charts/ProfitTrendChart";
import { Badge } from "../../components/ui/Badge";
import { StatCard } from "../../components/ui/StatCard";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useProducts } from "../../hooks/useInventory";
import { currency } from "../../lib/utils";

export function DashboardPage() {
  const { summary } = useAnalytics();
  const { data: products = [] } = useProducts();
  const lowStockProducts = products.filter((product) => product.quantityInStock <= product.minimumStockAlert);

  return (
    <div className="grid gap-5 animate-fade-in">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Live numbers from local IndexedDB storage.</p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total investment" value={currency(summary.totalInvestment)} detail={`${currency(summary.inventoryValue)} in current stock`} icon={<IndianRupee className="h-5 w-5" />} />
        <StatCard title="Revenue" value={currency(summary.totalRevenue)} detail="Filtered by all-time sales" icon={<ShoppingBag className="h-5 w-5" />} tone="blue" />
        <StatCard title="Total profit" value={currency(summary.totalProfit)} detail={`Today ${currency(summary.dailyProfit)}`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Stock quantity" value={String(summary.totalStockQuantity)} detail={`${summary.totalQuantitySold} sold`} icon={<Boxes className="h-5 w-5" />} tone="slate" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Daily profit" value={currency(summary.dailyProfit)} detail="Since midnight" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Weekly profit" value={currency(summary.weeklyProfit)} detail="Current week" icon={<TrendingUp className="h-5 w-5" />} tone="blue" />
        <StatCard title="Monthly profit" value={currency(summary.monthlyProfit)} detail="Current month" icon={<TrendingUp className="h-5 w-5" />} tone="amber" />
        <StatCard title="Stock alerts" value={String(summary.lowStockCount + summary.outOfStockCount)} detail={`${summary.outOfStockCount} out of stock`} icon={<PackageX className="h-5 w-5" />} tone="rose" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <ProfitTrendChart data={summary.profitTrend} />
        <ProductProfitChart data={summary.productWiseProfit} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <BestSellersChart data={summary.bestSellingProducts} />
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">Stock alerts</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Products at or below minimum quantity</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="grid gap-3">
            {lowStockProducts.length === 0 ? (
              <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">No low-stock products.</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-3 dark:border-slate-800">
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">{product.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{product.sku}</p>
                  </div>
                  <Badge tone={product.quantityInStock === 0 ? "danger" : "warning"}>{product.quantityInStock} left</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
