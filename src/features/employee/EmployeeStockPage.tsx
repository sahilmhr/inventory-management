import { PackageCheck, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { StatCard } from "../../components/ui/StatCard";
import { useProducts } from "../../hooks/useInventory";

export function EmployeeStockPage() {
  const { data: products = [] } = useProducts();
  const [query, setQuery] = useState("");
  const visibleProducts = useMemo(() => {
    const term = query.toLowerCase().trim();
    return products.filter((product) => product.name.toLowerCase().includes(term) || product.sku.toLowerCase().includes(term));
  }, [products, query]);

  return (
    <div className="grid gap-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black">Available Stock</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Product names and quantities only.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Products visible" value={String(products.length)} detail="Employee view" icon={<PackageCheck className="h-5 w-5" />} />
        <StatCard title="Available units" value={String(products.reduce((total, product) => total + product.quantityInStock, 0))} detail="No pricing data shown" icon={<PackageCheck className="h-5 w-5" />} tone="blue" />
      </section>

      <div className="relative rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Search className="pointer-events-none absolute left-7 top-7 h-5 w-5 text-slate-400" />
        <Input className="pl-10" placeholder="Search products" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visibleProducts.map((product) => (
          <article key={product.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <h2 className="min-w-0 truncate font-bold">{product.name}</h2>
              <Badge tone={product.quantityInStock === 0 ? "danger" : "success"}>{product.quantityInStock}</Badge>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
