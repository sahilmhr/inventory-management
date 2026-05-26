import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

const LoginPage = lazy(() => import("./features/auth/LoginPage").then((module) => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import("./features/dashboard/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const EmployeeStockPage = lazy(() => import("./features/employee/EmployeeStockPage").then((module) => ({ default: module.EmployeeStockPage })));
const InventoryPage = lazy(() => import("./features/inventory/InventoryPage").then((module) => ({ default: module.InventoryPage })));
const ReportsPage = lazy(() => import("./features/reports/ReportsPage").then((module) => ({ default: module.ReportsPage })));
const SalesPage = lazy(() => import("./features/sales/SalesPage").then((module) => ({ default: module.SalesPage })));
const SettingsPage = lazy(() => import("./features/settings/SettingsPage").then((module) => ({ default: module.SettingsPage })));
const SharePage = lazy(() => import("./features/share/SharePage").then((module) => ({ default: module.SharePage })));

function PageFallback() {
  return <div className="grid min-h-72 place-items-center text-sm font-medium text-slate-500 dark:text-slate-400">Loading...</div>;
}

export function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route index element={<DashboardPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/share" element={<SharePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route element={<ProtectedRoute roles={["employee", "admin"]} />}>
              <Route path="/employee-stock" element={<EmployeeStockPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
