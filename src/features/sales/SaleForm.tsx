import { zodResolver } from "@hookform/resolvers/zod";
import { ReceiptText } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { saleSchema } from "../../lib/validators";
import type { Product, SaleFormValues } from "../../types";

interface SaleFormProps {
  products: Product[];
  isSubmitting?: boolean;
  onSubmit: (values: SaleFormValues) => Promise<void> | void;
}

export function SaleForm({ products, isSubmitting, onSubmit }: SaleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      productId: "",
      quantitySold: 1,
      sellingPrice: 0,
      employeeName: ""
    }
  });

  const productId = watch("productId");
  const selectedProduct = products.find((product) => product.id === productId);
  const quantitySold = Number(watch("quantitySold") || 0);
  const sellingPrice = Number(watch("sellingPrice") || 0);

  useEffect(() => {
    if (selectedProduct) {
      setValue("sellingPrice", selectedProduct.sellingPrice, { shouldValidate: true });
    }
  }, [selectedProduct, setValue]);

  async function submit(values: SaleFormValues) {
    await onSubmit(values);
    reset({ productId: "", quantitySold: 1, sellingPrice: 0, employeeName: values.employeeName ?? "" });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Product" error={errors.productId?.message} {...register("productId")}>
          <option value="">Select product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id} disabled={product.quantityInStock === 0}>
              {product.name} ({product.quantityInStock} left)
            </option>
          ))}
        </Select>
        <Input label="Employee name" placeholder="Optional" error={errors.employeeName?.message} {...register("employeeName")} />
        <Input label="Quantity sold" type="number" min={1} max={selectedProduct?.quantityInStock ?? undefined} error={errors.quantitySold?.message} {...register("quantitySold")} />
        <Input label="Selling price" type="number" step="0.01" error={errors.sellingPrice?.message} {...register("sellingPrice")} />
      </div>
      <div className="flex flex-col gap-3 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-950 dark:text-white">Total sale amount</p>
          <p className="text-slate-500 dark:text-slate-400">{selectedProduct ? `${quantitySold} x ${sellingPrice}` : "Select a product"}</p>
        </div>
        <p className="text-2xl font-black text-brand-700 dark:text-brand-300">₹{Math.max(0, quantitySold * sellingPrice).toLocaleString("en-IN")}</p>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || products.length === 0} icon={<ReceiptText className="h-4 w-4" />}>
          {isSubmitting ? "Recording..." : "Record sale"}
        </Button>
      </div>
    </form>
  );
}
