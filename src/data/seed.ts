import { db } from "./db";
import { createSalt, hashPassword } from "../lib/security";
import { createId, getDeviceId } from "../lib/utils";
import type { AppUser, Product, Sale } from "../types";

const now = () => new Date().toISOString();

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

async function createSeedUser(username: string, displayName: string, password: string, role: AppUser["role"]): Promise<AppUser> {
  const salt = createSalt();

  return {
    id: createId("user"),
    username,
    displayName,
    role,
    active: true,
    passwordSalt: salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: now(),
    updatedAt: now(),
    syncStatus: "synced",
    deviceId: getDeviceId()
  };
}

export async function ensureSeedData() {
  const [userCount, productCount] = await Promise.all([db.users.count(), db.products.count()]);

  if (userCount === 0) {
    await db.users.bulkAdd([
      await createSeedUser(
        import.meta.env.VITE_DEMO_ADMIN_USERNAME || "admin",
        "Owner Admin",
        import.meta.env.VITE_DEMO_ADMIN_PASSWORD || "admin123",
        "admin"
      ),
      await createSeedUser(
        import.meta.env.VITE_DEMO_EMPLOYEE_USERNAME || "employee",
        "Store Employee",
        import.meta.env.VITE_DEMO_EMPLOYEE_PASSWORD || "employee123",
        "employee"
      )
    ]);
  }

  if (productCount > 0) {
    return;
  }

  const deviceId = getDeviceId();
  const products: Product[] = [
    {
      id: "product_rice_5kg",
      name: "Premium Rice 5kg",
      category: "Grocery",
      sku: "GROC-RICE-5KG",
      buyingPrice: 330,
      sellingPrice: 420,
      quantityInStock: 36,
      minimumStockAlert: 10,
      dateAdded: daysAgo(20),
      updatedAt: now(),
      syncStatus: "synced",
      deviceId
    },
    {
      id: "product_cooking_oil",
      name: "Sunflower Oil 1L",
      category: "Grocery",
      sku: "GROC-OIL-1L",
      buyingPrice: 105,
      sellingPrice: 142,
      quantityInStock: 8,
      minimumStockAlert: 12,
      dateAdded: daysAgo(18),
      updatedAt: now(),
      syncStatus: "synced",
      deviceId
    },
    {
      id: "product_notebook",
      name: "Classmate Notebook",
      category: "Stationery",
      sku: "STAT-NOTE-A4",
      buyingPrice: 38,
      sellingPrice: 55,
      quantityInStock: 54,
      minimumStockAlert: 15,
      dateAdded: daysAgo(14),
      updatedAt: now(),
      syncStatus: "synced",
      deviceId
    },
    {
      id: "product_toothpaste",
      name: "Herbal Toothpaste",
      category: "Personal Care",
      sku: "CARE-PASTE-150",
      buyingPrice: 62,
      sellingPrice: 89,
      quantityInStock: 0,
      minimumStockAlert: 8,
      dateAdded: daysAgo(12),
      updatedAt: now(),
      syncStatus: "synced",
      deviceId
    }
  ];

  const sales: Sale[] = [
    {
      id: createId("sale"),
      productId: "product_rice_5kg",
      productName: "Premium Rice 5kg",
      sku: "GROC-RICE-5KG",
      quantitySold: 4,
      sellingPrice: 420,
      buyingPriceAtSale: 330,
      totalAmount: 1680,
      profit: 360,
      soldAt: daysAgo(1),
      employeeName: "Maya",
      updatedAt: daysAgo(1),
      syncStatus: "synced",
      deviceId
    },
    {
      id: createId("sale"),
      productId: "product_notebook",
      productName: "Classmate Notebook",
      sku: "STAT-NOTE-A4",
      quantitySold: 12,
      sellingPrice: 55,
      buyingPriceAtSale: 38,
      totalAmount: 660,
      profit: 204,
      soldAt: daysAgo(3),
      employeeName: "Ravi",
      updatedAt: daysAgo(3),
      syncStatus: "synced",
      deviceId
    },
    {
      id: createId("sale"),
      productId: "product_cooking_oil",
      productName: "Sunflower Oil 1L",
      sku: "GROC-OIL-1L",
      quantitySold: 7,
      sellingPrice: 142,
      buyingPriceAtSale: 105,
      totalAmount: 994,
      profit: 259,
      soldAt: daysAgo(8),
      employeeName: "Maya",
      updatedAt: daysAgo(8),
      syncStatus: "synced",
      deviceId
    }
  ];

  await db.transaction("rw", db.products, db.sales, async () => {
    await db.products.bulkAdd(products);
    await db.sales.bulkAdd(sales);
  });
}
