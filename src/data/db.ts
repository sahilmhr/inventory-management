import Dexie, { type Table } from "dexie";
import type { AppUser, Product, Sale } from "../types";

class RetailPocketDatabase extends Dexie {
  products!: Table<Product, string>;
  sales!: Table<Sale, string>;
  users!: Table<AppUser, string>;

  constructor() {
    super("retail-pocket-db");

    this.version(1).stores({
      products: "id, sku, name, category, quantityInStock, minimumStockAlert, dateAdded, syncStatus, updatedAt",
      sales: "id, productId, productName, employeeName, soldAt, syncStatus, updatedAt",
      users: "id, username, role, active, syncStatus, updatedAt"
    });
  }
}

export const db = new RetailPocketDatabase();
