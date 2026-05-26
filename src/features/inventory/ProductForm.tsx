import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { productSchema } from "../../lib/validators";
import { readFileAsDataUrl } from "../../lib/utils";
import type { Product, ProductFormValues } from "../../types";

interface ProductFormProps {
  product?: Product | null;
  isSubmitting?: boolean;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
}

export function ProductForm({ product, isSubmitting, onSubmit }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      category: product?.category ?? "",
      sku: product?.sku ?? "",
      buyingPrice: product?.buyingPrice ?? 0,
      sellingPrice: product?.sellingPrice ?? 0,
      quantityInStock: product?.quantityInStock ?? 0,
      minimumStockAlert: product?.minimumStockAlert ?? 0,
      imageDataUrl: product?.imageDataUrl
    }
  });

  const imageDataUrl = watch("imageDataUrl");

  async function handleImageChange(file?: File) {
    if (!file) {
      return;
    }

    setValue("imageDataUrl", await readFileAsDataUrl(file), { shouldDirty: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Product name" error={errors.name?.message} {...register("name")} />
        <Input label="Category" error={errors.category?.message} {...register("category")} />
        <Input label="SKU / Product code" error={errors.sku?.message} {...register("sku")} />
        <Input label="Buying price" type="number" step="0.01" error={errors.buyingPrice?.message} {...register("buyingPrice")} />
        <Input label="Selling price" type="number" step="0.01" error={errors.sellingPrice?.message} {...register("sellingPrice")} />
        <Input label="Quantity in stock" type="number" error={errors.quantityInStock?.message} {...register("quantityInStock")} />
        <Input label="Minimum stock alert" type="number" error={errors.minimumStockAlert?.message} {...register("minimumStockAlert")} />
      </div>
      <label className="grid gap-2 rounded-lg border border-dashed border-slate-300 p-4 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">
        <span>Product image</span>
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
            {imageDataUrl ? <img src={imageDataUrl} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-7 w-7 text-slate-400" />}
          </div>
          <input type="file" accept="image/*" className="text-sm" onChange={(event) => handleImageChange(event.target.files?.[0])} />
        </div>
      </label>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} icon={<Save className="h-4 w-4" />}>
          {isSubmitting ? "Saving..." : "Save product"}
        </Button>
      </div>
    </form>
  );
}
