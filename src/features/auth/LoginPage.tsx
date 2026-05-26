import { zodResolver } from "@hookform/resolvers/zod";
import { Boxes, LockKeyhole, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import type { z } from "zod";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { loginSchema } from "../../lib/validators";
import { useAuthStore } from "../../stores/authStore";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "admin", password: "admin123" }
  });

  if (user) {
    return <Navigate to={user.role === "employee" ? "/employee-stock" : "/"} replace />;
  }

  async function onSubmit(values: LoginValues) {
    try {
      setError("");
      await login(values.username, values.password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? "/", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in");
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <section className="hidden items-center justify-center lg:flex">
        <div className="max-w-xl">
          <img src="/icons/icon.svg" alt="" className="h-20 w-20 rounded-2xl shadow-soft" />
          <h1 className="mt-8 text-5xl font-black leading-tight tracking-normal">Retail Pocket</h1>
          <p className="mt-5 text-xl leading-8 text-slate-600 dark:text-slate-300">
            Offline inventory, stock-aware sales, profit analytics, and employee-safe availability sharing for small shops.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Inventory", "Sales", "Reports"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid place-items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-brand-700 text-white">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Sign in</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Demo admin: admin / admin123</p>
            </div>
          </div>
          <div className="grid gap-4">
            <Input label="Username" autoComplete="username" error={errors.username?.message} {...register("username")} />
            <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register("password")} />
            {error ? <div className="rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-100">{error}</div> : null}
            <Button type="submit" disabled={isSubmitting} icon={<LockKeyhole className="h-4 w-4" />}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </div>
          <div className="mt-5 grid gap-2 rounded-md bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
            <p className="flex items-center gap-2">
              <User className="h-4 w-4" /> Employee demo: employee / employee123
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
