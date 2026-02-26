import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, Download, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const Footer = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installHidden, setInstallHidden] = useState(false);
  const [manualHint, setManualHint] = useState("");

  const dismissedKey = "mailbrain_install_popup_dismissed_at";

  const isStandalone = useMemo(() => {
    if (typeof window === "undefined") return false;
    const nav = window.navigator as Navigator & { standalone?: boolean };
    return window.matchMedia("(display-mode: standalone)").matches || Boolean(nav.standalone);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissedAt = Number(localStorage.getItem(dismissedKey) || 0);
    const recentlyDismissed = Date.now() - dismissedAt < 3 * 24 * 60 * 60 * 1000;
    if (recentlyDismissed) setInstallHidden(true);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  const closeInstallPopup = () => {
    setInstallHidden(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(dismissedKey, String(Date.now()));
    }
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstallHidden(true);
      }
      setDeferredPrompt(null);
      return;
    }

    setManualHint("On mobile, open browser menu and tap 'Add to Home Screen'.");
  };

  const showInstallPopup = !installHidden && !isStandalone && (Boolean(deferredPrompt) || Boolean(manualHint));

  const footerLinks = {
    Product: ["Features", "Integrations", "Pricing", "FAQ"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <footer className="bg-secondary/20 border-t border-border py-16 relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        animate={{
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-12 mb-12"
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} className="mb-4 inline-block">
              <Link to="/" aria-label="Go to landing page">
                <img src={logo} alt="MailMind" className="h-8" />
              </Link>
            </motion.div>
            <p className="text-sm text-muted-foreground mb-6">
              Intelligent email automation for modern professionals.
            </p>
            <div className="mb-4">
              <Button onClick={handleInstall} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="mr-2 h-4 w-4" />
                Download App
              </Button>
              {manualHint && <p className="mt-2 text-xs text-muted-foreground">{manualHint}</p>}
            </div>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center hover:bg-primary/20 transition-colors hover-glow"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div 
              key={category}
              variants={itemVariants}
            >
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li 
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + categoryIndex * 0.1 + linkIndex * 0.05 }}
                  >
                    <motion.a
                      href={`#${link.toLowerCase()}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline"
                      whileHover={{ x: 3 }}
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground">
            2025 MailMind. All rights reserved.
          </p>
          <motion.p 
            className="text-sm text-muted-foreground"
            animate={{ 
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Made with care for productivity enthusiasts
          </motion.p>
        </motion.div>
      </div>

      {showInstallPopup && (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-xl border border-border bg-background/95 backdrop-blur p-4 shadow-xl">
          <button
            onClick={closeInstallPopup}
            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
            aria-label="Close install popup"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold text-foreground">Install MailMind App</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add MailMind to your home screen for faster access like a mobile app.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={handleInstall} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Download className="mr-2 h-4 w-4" />
              Install
            </Button>
            <Button size="sm" variant="outline" onClick={closeInstallPopup}>
              Not now
            </Button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;


