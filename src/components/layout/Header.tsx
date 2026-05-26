import { Download, LogOut, Moon, Sun, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useAuthStore } from "../../stores/authStore";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [online, setOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dark, setDark] = useState(() => localStorage.getItem("retail-pocket-theme") === "dark");

  useEffect(() => {
    const handleOnline = () => setOnline(navigator.onLine);
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOnline);
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOnline);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("retail-pocket-theme", dark ? "dark" : "light");
  }, [dark]);

  async function handleInstall() {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 lg:hidden">
            <img src="/icons/icon.svg" alt="" className="h-9 w-9 rounded-md" />
            <p className="font-bold text-slate-950 dark:text-white">Retail Pocket</p>
          </div>
          <p className="hidden text-sm text-slate-500 dark:text-slate-400 lg:block">Welcome back, {user?.displayName}</p>
          <p className="hidden text-xl font-bold text-slate-950 dark:text-white lg:block">Shop operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={online ? "success" : "warning"} className="hidden sm:inline-flex">
            {online ? <Wifi className="mr-1 h-3.5 w-3.5" /> : <WifiOff className="mr-1 h-3.5 w-3.5" />}
            {online ? "Online" : "Offline"}
          </Badge>
          {installPrompt ? (
            <Button variant="secondary" className="hidden sm:inline-flex" icon={<Download className="h-4 w-4" />} onClick={handleInstall}>
              Install
            </Button>
          ) : null}
          <Button aria-label="Toggle dark mode" variant="ghost" className="h-10 w-10 px-0" onClick={() => setDark((value) => !value)}>
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button aria-label="Log out" variant="ghost" className="h-10 w-10 px-0" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
