import { formatDateTime } from "./dates";
import { currency, downloadBlob, downloadText } from "./utils";
import type { AnalyticsSummary, Product, Sale } from "../types";

function csvEscape(value: string | number | undefined) {
  const text = value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(headers: string[], rows: Array<Array<string | number | undefined>>) {
  return [headers.map(csvEscape).join(","), ...rows.map((row) => row.map(csvEscape).join(","))].join("\n");
}

export function exportInventoryCsv(products: Product[]) {
  const csv = toCsv(
    ["Name", "Category", "SKU", "Selling Price", "Quantity", "Minimum Alert", "Date Added"],
    products.map((product) => [
      product.name,
      product.category,
      product.sku,
      product.sellingPrice,
      product.quantityInStock,
      product.minimumStockAlert,
      product.dateAdded
    ])
  );
  downloadText(`inventory-${Date.now()}.csv`, csv, "text/csv;charset=utf-8");
}

export function exportSalesCsv(sales: Sale[]) {
  const csv = toCsv(
    ["Date", "Product", "SKU", "Qty", "Selling Price", "Total", "Profit", "Employee"],
    sales.map((sale) => [
      formatDateTime(sale.soldAt),
      sale.productName,
      sale.sku,
      sale.quantitySold,
      sale.sellingPrice,
      sale.totalAmount,
      sale.profit,
      sale.employeeName
    ])
  );
  downloadText(`sales-${Date.now()}.csv`, csv, "text/csv;charset=utf-8");
}

export async function exportSalesExcel(sales: Sale[]) {
  const csv = toCsv(
    ["Date", "Product", "SKU", "Quantity", "Selling price", "Total", "Profit", "Employee"],
    sales.map((sale) => [
      formatDateTime(sale.soldAt),
      sale.productName,
      sale.sku,
      sale.quantitySold,
      sale.sellingPrice,
      sale.totalAmount,
      sale.profit,
      sale.employeeName
    ])
  );
  downloadText(`sales-excel-compatible-${Date.now()}.csv`, csv, "text/csv;charset=utf-8");
}

export async function exportProfitPdf(summary: AnalyticsSummary, sales: Sale[]) {
  const lines = [
    "Retail Pocket Profit Report",
    `Generated: ${formatDateTime(new Date().toISOString())}`,
    "",
    `Total Revenue: ${currency(summary.totalRevenue)}`,
    `Total Profit: ${currency(summary.totalProfit)}`,
    `Inventory Value: ${currency(summary.inventoryValue)}`,
    "",
    "Recent Sales",
    ...sales.slice(0, 60).map((sale) => `${formatDateTime(sale.soldAt)} | ${sale.productName} | Qty ${sale.quantitySold} | Profit ${currency(sale.profit)}`)
  ];

  await exportLinesPdf(`profit-report-${Date.now()}.pdf`, lines);
}

export async function exportEmployeeStockPdf(products: Product[]) {
  await exportLinesPdf(`employee-stock-${Date.now()}.pdf`, [
    "Available Stock",
    `Generated: ${formatDateTime(new Date().toISOString())}`,
    "",
    ...products.map((product) => `${product.name} - ${product.quantityInStock} available`)
  ]);
}

export function buildEmployeeShareText(products: Product[]) {
  return [
    "Available stock",
    `Updated: ${formatDateTime(new Date().toISOString())}`,
    "",
    ...products.map((product) => `${product.name}: ${product.quantityInStock}`)
  ].join("\n");
}

async function exportLinesPdf(filename: string, lines: string[]) {
  const pdf = buildSimplePdf(lines);
  downloadBlob(filename, new Blob([pdf], { type: "application/pdf" }));
}

function buildSimplePdf(lines: string[]) {
  const wrappedLines = lines.flatMap((line) => wrapPdfLine(line));
  const pages = chunk(wrappedLines, 48);
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];
  const pageIds: number[] = [];

  pages.forEach((pageLines) => {
    const content = buildPdfPageStream(pageLines);
    const contentId = objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    const pageId = objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    pageIds.push(pageId);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

function buildPdfPageStream(lines: string[]) {
  let y = 802;

  return lines
    .map((line, index) => {
      const size = index === 0 ? 18 : 10;
      const command = `BT /F1 ${size} Tf 42 ${y} Td ${toPdfUtf16Hex(line)} Tj ET`;
      y -= index === 0 ? 26 : 15;
      return command;
    })
    .join("\n");
}

function toPdfUtf16Hex(value: string) {
  const text = value.replace(/\s+/g, " ").trim();
  let hex = "FEFF";

  for (let index = 0; index < text.length; index += 1) {
    hex += text.charCodeAt(index).toString(16).padStart(4, "0").toUpperCase();
  }

  return `<${hex}>`;
}

function wrapPdfLine(line: string) {
  const maxLength = 92;

  if (line.length <= maxLength) {
    return [line];
  }

  const words = line.split(" ");
  const rows: string[] = [];
  let current = "";

  words.forEach((word) => {
    if (`${current} ${word}`.trim().length > maxLength) {
      if (current) {
        rows.push(current);
      }
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  });

  if (current) {
    rows.push(current);
  }

  return rows;
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks.length > 0 ? chunks : [[]];
}
