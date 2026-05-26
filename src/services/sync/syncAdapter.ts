import { db } from "../../data/db";
import type { Product, Sale } from "../../types";

export interface CloudSyncAdapter {
  pushProducts(products: Product[]): Promise<void>;
  pushSales(sales: Sale[]): Promise<void>;
  pullChanges(lastPulledAt?: string): Promise<{ products: Product[]; sales: Sale[] }>;
}

export class LocalOnlySyncAdapter implements CloudSyncAdapter {
  async pushProducts() {
    return Promise.resolve();
  }

  async pushSales() {
    return Promise.resolve();
  }

  async pullChanges() {
    return Promise.resolve({ products: [], sales: [] });
  }
}

export async function getPendingSyncCounts() {
  const [products, sales] = await Promise.all([
    db.products.where("syncStatus").equals("pending").count(),
    db.sales.where("syncStatus").equals("pending").count()
  ]);

  return { products, sales };
}
