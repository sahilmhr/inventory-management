import { db } from "../data/db";
import { createId, getDeviceId, normalizeSku } from "../lib/utils";
import type { Product, ProductFormValues } from "../types";

const stamp = () => ({
  updatedAt: new Date().toISOString(),
  syncStatus: "pending" as const,
  deviceId: getDeviceId()
});

export const productRepository = {
  async list() {
    const products = await db.products.toArray();
    return products.sort((a, b) => a.name.localeCompare(b.name));
  },

  async getById(id: string) {
    return db.products.get(id);
  },

  async create(values: ProductFormValues) {
    const product: Product = {
      ...values,
      sku: normalizeSku(values.sku),
      id: createId("product"),
      dateAdded: new Date().toISOString(),
      ...stamp()
    };

    await db.products.add(product);
    return product;
  },

  async update(id: string, values: ProductFormValues) {
    const existing = await db.products.get(id);

    if (!existing) {
      throw new Error("Product not found");
    }

    const product: Product = {
      ...existing,
      ...values,
      sku: normalizeSku(values.sku),
      ...stamp()
    };

    await db.products.put(product);
    return product;
  },

  async remove(id: string) {
    await db.products.delete(id);
  },

  async adjustStock(productId: string, quantityDelta: number) {
    const product = await db.products.get(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const nextQuantity = product.quantityInStock + quantityDelta;

    if (nextQuantity < 0) {
      throw new Error("Insufficient stock");
    }

    await db.products.update(productId, {
      quantityInStock: nextQuantity,
      ...stamp()
    });
  }
};
