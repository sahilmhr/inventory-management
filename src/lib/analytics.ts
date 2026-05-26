import { addDays, endOfDay, isWithin, resolvePeriodRange, startOfDay, startOfMonth, startOfWeek } from "./dates";
import type { AnalyticsSummary, Product, ProductProfitRow, ReportFilters, Sale } from "../types";

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function salesInRange(sales: Sale[], start?: Date, end?: Date) {
  return sales.filter((sale) => isWithin(sale.soldAt, start, end));
}

function productRows(sales: Sale[]): ProductProfitRow[] {
  const rows = new Map<string, ProductProfitRow>();

  for (const sale of sales) {
    const existing =
      rows.get(sale.productId) ??
      ({
        productId: sale.productId,
        productName: sale.productName,
        sku: sale.sku,
        quantitySold: 0,
        revenue: 0,
        profit: 0
      } satisfies ProductProfitRow);

    existing.quantitySold += sale.quantitySold;
    existing.revenue += sale.totalAmount;
    existing.profit += sale.profit;
    rows.set(sale.productId, existing);
  }

  return Array.from(rows.values()).sort((a, b) => b.profit - a.profit);
}

export function buildAnalytics(products: Product[], sales: Sale[], filters?: Partial<ReportFilters>): AnalyticsSummary {
  const now = new Date();
  const filteredRange = resolvePeriodRange(filters?.period ?? "all", filters?.startDate, filters?.endDate);
  const filteredSales = salesInRange(sales, filteredRange.start, filteredRange.end).filter((sale) => {
    if (filters?.productId && sale.productId !== filters.productId) {
      return false;
    }

    if (filters?.employeeName && sale.employeeName !== filters.employeeName) {
      return false;
    }

    return true;
  });

  const todaySales = salesInRange(sales, startOfDay(now), endOfDay(now));
  const weekSales = salesInRange(sales, startOfWeek(now), endOfDay(now));
  const monthSales = salesInRange(sales, startOfMonth(now), endOfDay(now));
  const totalSoldCost = sum(sales.map((sale) => sale.buyingPriceAtSale * sale.quantitySold));
  const inventoryValue = sum(products.map((product) => product.buyingPrice * product.quantityInStock));
  const productWiseProfit = productRows(filteredSales);

  const profitTrend = Array.from({ length: 7 }, (_, index) => {
    const day = startOfDay(addDays(now, index - 6));
    const daySales = salesInRange(sales, day, endOfDay(day));

    return {
      label: new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(day),
      profit: sum(daySales.map((sale) => sale.profit)),
      revenue: sum(daySales.map((sale) => sale.totalAmount))
    };
  });

  return {
    totalStockQuantity: sum(products.map((product) => product.quantityInStock)),
    totalQuantitySold: sum(sales.map((sale) => sale.quantitySold)),
    outOfStockCount: products.filter((product) => product.quantityInStock === 0).length,
    lowStockCount: products.filter(
      (product) => product.quantityInStock > 0 && product.quantityInStock <= product.minimumStockAlert
    ).length,
    totalInvestment: inventoryValue + totalSoldCost,
    inventoryValue,
    totalRevenue: sum(filteredSales.map((sale) => sale.totalAmount)),
    totalProfit: sum(filteredSales.map((sale) => sale.profit)),
    dailyProfit: sum(todaySales.map((sale) => sale.profit)),
    weeklyProfit: sum(weekSales.map((sale) => sale.profit)),
    monthlyProfit: sum(monthSales.map((sale) => sale.profit)),
    customRangeProfit: sum(filteredSales.map((sale) => sale.profit)),
    productWiseProfit,
    bestSellingProducts: [...productWiseProfit].sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 5),
    profitTrend
  };
}
