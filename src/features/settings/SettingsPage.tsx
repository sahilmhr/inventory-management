import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Download, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { db } from "../../data/db";
import { useCreateUser, useToggleUserActive, useUsers } from "../../hooks/useUsers";
import { requestNotificationPermission } from "../../services/notifications";
import { employeeSchema } from "../../lib/validators";
import { downloadText } from "../../lib/utils";
import type { EmployeeFormValues } from "../../types";

export function SettingsPage() {
  const { data: users = [] } = useUsers();
  const createUser = useCreateUser();
  const toggleUser = useToggleUserActive();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      username: "",
      displayName: "",
      password: "",
      role: "employee"
    }
  });

  async function onCreateUser(values: EmployeeFormValues) {
    await createUser.mutateAsync(values);
    reset({ username: "", displayName: "", password: "", role: "employee" });
  }

  async function exportBackup() {
    const [products, sales, appUsers] = await Promise.all([db.products.toArray(), db.sales.toArray(), db.users.toArray()]);
    downloadText(
      `retail-pocket-backup-${Date.now()}.json`,
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          version: 1,
          products,
          sales,
          users: appUsers
        },
        null,
        2
      ),
      "application/json;charset=utf-8"
    );
  }

  async function enableNotifications() {
    const result = await requestNotificationPermission();
    setMessage(result === "granted" ? "Notifications enabled." : "Notification permission was not granted.");
  }

  return (
    <div className="grid gap-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black">Employees</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage local users and admin-only utilities.</p>
      </div>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit(onCreateUser)} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-brand-700 dark:text-brand-300" />
            <h2 className="font-bold">Add user</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Display name" error={errors.displayName?.message} {...register("displayName")} />
            <Input label="Username" error={errors.username?.message} {...register("username")} />
            <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />
            <Select label="Role" error={errors.role?.message} {...register("role")}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || createUser.isPending} icon={<ShieldCheck className="h-4 w-4" />}>
              {createUser.isPending ? "Creating..." : "Create user"}
            </Button>
          </div>
          {createUser.error ? (
            <div className="rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-100">{createUser.error.message}</div>
          ) : null}
        </form>

        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-bold">User access</h2>
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-3 dark:border-slate-800">
              <div>
                <p className="font-semibold">{user.displayName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.username}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={user.role === "admin" ? "info" : "neutral"}>{user.role}</Badge>
                <Button
                  variant={user.active ? "secondary" : "primary"}
                  onClick={() => toggleUser.mutate({ id: user.id, active: !user.active })}
                  disabled={toggleUser.isPending}
                >
                  {user.active ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2">
        <div>
          <h2 className="font-bold">Local backup</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Exports products, sales, and local users as JSON.</p>
        </div>
        <div className="flex flex-wrap items-start justify-end gap-2">
          <Button variant="secondary" icon={<Download className="h-4 w-4" />} onClick={exportBackup}>
            Backup
          </Button>
          <Button variant="secondary" icon={<Bell className="h-4 w-4" />} onClick={enableNotifications}>
            Notifications
          </Button>
        </div>
        {message ? <div className="sm:col-span-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">{message}</div> : null}
      </section>
    </div>
  );
}
