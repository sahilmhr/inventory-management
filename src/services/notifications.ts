import type { Product } from "../types";

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return "unsupported" as const;
  }

  if (Notification.permission === "granted") {
    return "granted" as const;
  }

  return Notification.requestPermission();
}

export async function notifyLowStock(products: Product[]) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const lowStock = products.filter((product) => product.quantityInStock <= product.minimumStockAlert);

  if (lowStock.length === 0) {
    return;
  }

  new Notification("Retail Pocket stock alert", {
    body: `${lowStock.length} product${lowStock.length === 1 ? "" : "s"} need attention.`
  });
}
