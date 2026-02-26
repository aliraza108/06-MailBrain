import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BeforeInstallPromptEvent,
  getManualInstallHint,
  isStandaloneApp,
  setDeferredInstallPrompt,
  triggerInstallPrompt,
} from "@/lib/pwaInstall";

const AppInstallPrompt = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [manualHint, setManualHint] = useState("");
  const [installed, setInstalled] = useState(() => isStandaloneApp());

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setInstalled(true);
      setVisible(false);
      setDeferredInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (installed) return;
    setVisible(false);
    setManualHint("");
    const timer = window.setTimeout(() => setVisible(true), 5000);
    return () => window.clearTimeout(timer);
  }, [installed, location.pathname]);

  const handleInstall = async () => {
    const result = await triggerInstallPrompt();
    if (result === "accepted") {
      setVisible(false);
      return;
    }
    if (result === "dismissed") return;
    setManualHint(getManualInstallHint());
  };

  if (!visible || installed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-xl border border-border bg-background/95 backdrop-blur p-4 shadow-xl">
      <button
        onClick={() => setVisible(false)}
        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
        aria-label="Close install popup"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="text-sm font-semibold text-foreground">Install MailMind App</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Install on your phone for app-like access from your home screen.
      </p>
      {manualHint && <p className="mt-2 text-xs text-muted-foreground">{manualHint}</p>}
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={handleInstall} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Download className="mr-2 h-4 w-4" />
          Install
        </Button>
        <Button size="sm" variant="outline" onClick={() => setVisible(false)}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default AppInstallPrompt;
