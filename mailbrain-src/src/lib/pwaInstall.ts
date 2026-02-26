export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    __mailmindInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export function isStandaloneApp(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || Boolean(nav.standalone);
}

export function setDeferredInstallPrompt(event: BeforeInstallPromptEvent | null): void {
  if (typeof window === "undefined") return;
  window.__mailmindInstallPrompt = event;
}

export function getDeferredInstallPrompt(): BeforeInstallPromptEvent | null {
  if (typeof window === "undefined") return null;
  return window.__mailmindInstallPrompt || null;
}

export async function triggerInstallPrompt(): Promise<"accepted" | "dismissed" | "unavailable"> {
  const deferred = getDeferredInstallPrompt();
  if (!deferred) return "unavailable";

  await deferred.prompt();
  const choice = await deferred.userChoice;
  setDeferredInstallPrompt(null);
  return choice.outcome;
}

export function getManualInstallHint(): string {
  return "Use browser menu and tap 'Add to Home Screen'.";
}
