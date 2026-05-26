import { db } from "../data/db";
import { createId, getDeviceId } from "../lib/utils";
import type { ReportFilters, Sale, SaleFormValues } from "../types";
import { resolvePeriodRange, isWithin } from "../lib/dates";

const stamp = () => ({
  updatedAt: new Date().toISOString(),
  syncStatus: "pending" as const,
  deviceId: getDeviceId()
});

export const salesRepository = {
  async list(filters?: Partial<ReportFilters>) {
    const sales = await db.sales.toArray();
    const range = filters ? resolvePeriodRange(filters.period ?? "all", filters.startDate, filters.endDate) : {};

    return sales
      .filter((sale) => {
        if (filters?.productId && sale.productId !== filters.productId) {
          return false;
        }

        if (filters?.employeeName && sale.employeeName !== filters.employeeName) {
          return false;
        }

        return isWithin(sale.soldAt, range.start, range.end);
      })
      .sort((a, b) => new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime());
  },

  async record(values: SaleFormValues) {
    return db.transaction("rw", db.products, db.sales, async () => {
      const product = await db.products.get(values.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.quantityInStock < values.quantitySold) {
        throw new Error(`Only ${product.quantityInStock} units available`);
      }

      const sellingPrice = values.sellingPrice || product.sellingPrice;
      const totalAmount = sellingPrice * values.quantitySold;
      const profit = (sellingPrice - product.buyingPrice) * values.quantitySold;
      const sale: Sale = {
        id: createId("sale"),
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantitySold: values.quantitySold,
        sellingPrice,
        buyingPriceAtSale: product.buyingPrice,
        totalAmount,
        profit,
        soldAt: new Date().toISOString(),
        employeeName: values.employeeName?.trim() || undefined,
        ...stamp()
      };

      await db.sales.add(sale);
      await db.products.update(product.id, {
        quantityInStock: product.quantityInStock - values.quantitySold,
        ...stamp()
      });

      return sale;
    });
  }
};
