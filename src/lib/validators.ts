import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(2, "Enter a username"),
  password: z.string().min(4, "Enter a password")
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required"),
  category: z.string().trim().min(2, "Category is required"),
  sku: z.string().trim().min(2, "SKU is required"),
  buyingPrice: z.coerce.number().min(0, "Buying price cannot be negative"),
  sellingPrice: z.coerce.number().min(0, "Selling price cannot be negative"),
  quantityInStock: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  minimumStockAlert: z.coerce.number().int().min(0, "Minimum stock cannot be negative"),
  imageDataUrl: z.string().optional()
});

export const saleSchema = z.object({
  productId: z.string().min(1, "Select a product"),
  quantitySold: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  sellingPrice: z.coerce.number().min(0, "Selling price cannot be negative"),
  employeeName: z.string().trim().optional()
});

export const employeeSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  displayName: z.string().trim().min(2, "Display name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "employee"])
});
