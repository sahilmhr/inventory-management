import { Edit3, Trash2 } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { currency } from "../../lib/utils";
import type { Product } from "../../types";

export function ProductCard({ product, onEdit, onDelete }: { product: Product; onEdit: () => void; onDelete: () => void }) {
  const stockTone = product.quantityInStock === 0 ? "danger" : product.quantityInStock <= product.minimumStockAlert ? "warning" : "success";

  return (
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex gap-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-md bg-slate-100 text-lg font-black text-slate-400 dark:bg-slate-800">
          {product.imageDataUrl ? <img src={product.imageDataUrl} alt="" className="h-full w-full object-cover" /> : product.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-slate-950 dark:text-white">{product.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{product.category} · {product.sku}</p>
            </div>
            <Badge tone={stockTone}>{product.quantityInStock} in stock</Badge>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Buy</p>
              <p className="font-bold">{currency(product.buyingPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sell</p>
              <p className="font-bold">{currency(product.sellingPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Alert</p>
              <p className="font-bold">{product.minimumStockAlert}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <Button variant="secondary" onClick={onEdit} icon={<Edit3 className="h-4 w-4" />}>
          Edit
        </Button>
        <Button variant="danger" onClick={onDelete} icon={<Trash2 className="h-4 w-4" />}>
          Delete
        </Button>
      </div>
    </article>
  );
}
