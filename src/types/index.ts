export type Role = "admin" | "employee";

export type SyncStatus = "synced" | "pending" | "error";

export interface SyncMeta {
  syncStatus: SyncStatus;
  updatedAt: string;
  deviceId: string;
}

export interface Product extends SyncMeta {
  id: string;
  name: string;
  category: string;
  sku: string;
  buyingPrice: number;
  sellingPrice: number;
  quantityInStock: number;
  minimumStockAlert: number;
  imageDataUrl?: string;
  dateAdded: string;
}

export interface Sale extends SyncMeta {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantitySold: number;
  sellingPrice: number;
  buyingPriceAtSale: number;
  totalAmount: number;
  profit: number;
  soldAt: string;
  employeeName?: string;
}

export interface AppUser extends SyncMeta {
  id: string;
  username: string;
  displayName: string;
  role: Role;
  passwordHash: string;
  passwordSalt: string;
  active: boolean;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  role: Role;
}

export interface ReportFilters {
  period: "day" | "week" | "month" | "custom" | "all";
  startDate?: string;
  endDate?: string;
  productId?: string;
  employeeName?: string;
}

export interface ProductProfitRow {
  productId: string;
  productName: string;
  sku: string;
  quantitySold: number;
  revenue: number;
  profit: number;
}

export interface AnalyticsSummary {
  totalStockQuantity: number;
  totalQuantitySold: number;
  outOfStockCount: number;
  lowStockCount: number;
  totalInvestment: number;
  inventoryValue: number;
  totalRevenue: number;
  totalProfit: number;
  dailyProfit: number;
  weeklyProfit: number;
  monthlyProfit: number;
  customRangeProfit: number;
  productWiseProfit: ProductProfitRow[];
  bestSellingProducts: ProductProfitRow[];
  profitTrend: Array<{ label: string; profit: number; revenue: number }>;
}

export type ProductFormValues = Omit<Product, "id" | "dateAdded" | keyof SyncMeta>;

export interface SaleFormValues {
  productId: string;
  quantitySold: number;
  sellingPrice: number;
  employeeName?: string;
}

export interface EmployeeFormValues {
  username: string;
  displayName: string;
  password: string;
  role: Role;
}
