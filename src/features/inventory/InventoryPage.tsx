import { Boxes, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { StatCard } from "../../components/ui/StatCard";
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct } from "../../hooks/useInventory";
import { currency } from "../../lib/utils";
import type { Product, ProductFormValues } from "../../types";
import { ProductCard } from "./ProductCard";
import { ProductForm } from "./ProductForm";

export function InventoryPage() {
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const categories = useMemo(() => ["all", ...Array.from(new Set(products.map((product) => product.category)))], [products]);
  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesSearch = [product.name, product.category, product.sku].join(" ").toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, query, category]);

  const stockValue = products.reduce((total, product) => total + product.buyingPrice * product.quantityInStock, 0);
  const sellingValue = products.reduce((total, product) => total + product.sellingPrice * product.quantityInStock, 0);

  async function handleSubmit(values: ProductFormValues) {
    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, values });
    } else {
      await createProduct.mutateAsync(values);
    }

    setFormOpen(false);
    setEditingProduct(null);
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(`Delete ${product.name}? Sales history will keep its saved product snapshot.`);

    if (confirmed) {
      await deleteProduct.mutateAsync(product.id);
    }
  }

  return (
    <div className="grid gap-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black">Inventory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Products, stock levels, prices, and alerts.</p>
        </div>
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setEditingProduct(null);
            setFormOpen(true);
          }}
        >
          Add product
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Products" value={String(products.length)} detail="Active items" icon={<Boxes className="h-5 w-5" />} />
        <StatCard title="Total quantity" value={String(products.reduce((total, product) => total + product.quantityInStock, 0))} detail="Units remaining" icon={<Boxes className="h-5 w-5" />} tone="blue" />
        <StatCard title="Inventory value" value={currency(stockValue)} detail="Based on buying price" icon={<Boxes className="h-5 w-5" />} tone="amber" />
        <StatCard title="Potential revenue" value={currency(sellingValue)} detail="Based on selling price" icon={<Boxes className="h-5 w-5" />} tone="slate" />
      </section>

      <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Input className="pl-10" placeholder="Search name, SKU, category" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <select
          className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All categories" : item}
            </option>
          ))}
        </select>
      </section>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">Loading inventory...</div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState title="No products found" description="Add a product or adjust the current filter." />
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => {
                setEditingProduct(product);
                setFormOpen(true);
              }}
              onDelete={() => handleDelete(product)}
            />
          ))}
        </section>
      )}

      <Modal open={formOpen} title={editingProduct ? "Edit product" : "Add product"} onClose={() => setFormOpen(false)}>
        <ProductForm product={editingProduct} isSubmitting={createProduct.isPending || updateProduct.isPending} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
