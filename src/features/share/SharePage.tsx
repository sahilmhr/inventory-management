import { Copy, Download, MessageCircle, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useProducts } from "../../hooks/useInventory";
import { buildEmployeeShareText, exportEmployeeStockPdf } from "../../lib/export";
import { downloadText } from "../../lib/utils";

export function SharePage() {
  const { data: products = [] } = useProducts();
  const [query, setQuery] = useState("");
  const safeProducts = useMemo(() => {
    const term = query.toLowerCase().trim();
    return products
      .filter((product) => product.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, query]);
  const shareText = buildEmployeeShareText(safeProducts);

  async function copyShareText() {
    await navigator.clipboard.writeText(shareText);
  }

  function openWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title: "Available stock", text: shareText });
    } else {
      await copyShareText();
    }
  }

  return (
    <div className="grid gap-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black">Employee Share</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Only names and available quantities are included.</p>
        </div>
        <Badge tone="success">Sensitive fields hidden</Badge>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Input placeholder="Search stock to share" value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button icon={<MessageCircle className="h-4 w-4" />} onClick={openWhatsApp}>
            WhatsApp
          </Button>
          <Button variant="secondary" icon={<Share2 className="h-4 w-4" />} onClick={nativeShare}>
            Share
          </Button>
          <Button variant="secondary" icon={<Copy className="h-4 w-4" />} onClick={copyShareText}>
            Copy text
          </Button>
          <Button variant="secondary" icon={<Download className="h-4 w-4" />} onClick={() => downloadText(`employee-stock-${Date.now()}.txt`, shareText)}>
            Text
          </Button>
          <Button variant="secondary" icon={<Download className="h-4 w-4" />} onClick={() => exportEmployeeStockPdf(safeProducts)}>
            PDF
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {safeProducts.map((product) => (
          <article key={product.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate font-bold">{product.name}</h2>
              </div>
              <Badge tone={product.quantityInStock === 0 ? "danger" : product.quantityInStock <= product.minimumStockAlert ? "warning" : "success"}>
                {product.quantityInStock} available
              </Badge>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
