"use client";

import { useState } from "react";
import { Share2, Link2, Check, Smartphone } from "lucide-react";
import { toast } from "sonner";

import type { App } from "@/data/appCatalog";
import {
  storeAppUrl,
  upAppBrowserUrl,
  webShareData,
  canWebShare,
  tweetIntentUrl,
  telegramShareUrl,
  whatsappShareUrl,
} from "@/lib/deepLink";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareAppButtonProps {
  app: App;
  /** "icon" (header affordance) or "label" (full button in an action row). */
  variant?: "icon" | "label";
  className?: string;
}

/* ---- Brand glyphs (official Simple Icons paths) ---- */
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}
function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.061 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.582 0 11.94-5.335 11.944-11.893a11.821 11.821 0 0 0-3.467-8.4" />
    </svg>
  );
}

/**
 * ShareAppButton — a dropdown of share targets for one store app.
 *
 * Every social/copy/native target points at the OG-rich store detail page so
 * the link previews nicely and auto-opens the UP mobile app where installed.
 * "Open in UP mobile app" instead deep-links the live dapp into UP's in-app
 * browser. Available on every app via the detail page header.
 */
export default function ShareAppButton({
  app,
  variant = "icon",
  className,
}: ShareAppButtonProps) {
  const hydrated = useHydrated();
  const [copied, setCopied] = useState(false);

  const shareUrl = storeAppUrl(app);
  const showNativeShare = hydrated && canWebShare();

  const handleNativeShare = async () => {
    try {
      await navigator.share(webShareData(app));
    } catch {
      // User dismissed the share sheet, or the gesture was interrupted — no-op.
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const trigger =
    variant === "label" ? (
      <button
        type="button"
        aria-label={`Share ${app.app?.name ?? "this app"}`}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border-strong bg-transparent px-4 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
          className
        )}
      >
        <Share2 className="h-4 w-4" aria-hidden />
        <span>Share</span>
      </button>
    ) : (
      <button
        type="button"
        aria-label={`Share ${app.app?.name ?? "this app"}`}
        className={cn(
          "relative inline-flex h-11 min-h-[44px] w-11 items-center justify-center rounded-full text-text-secondary transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
          className
        )}
      >
        <Share2 className="h-5 w-5" aria-hidden />
      </button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share this app</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {showNativeShare && (
          <DropdownMenuItem onSelect={() => void handleNativeShare()}>
            <Share2 className="text-text-secondary" aria-hidden />
            <span>Share…</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onSelect={() => void handleCopy()}>
          {copied ? (
            <Check className="text-brand" aria-hidden />
          ) : (
            <Link2 className="text-text-secondary" aria-hidden />
          )}
          <span>{copied ? "Copied!" : "Copy link"}</span>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href={upAppBrowserUrl(app.app.url)}>
            <Smartphone className="text-text-secondary" aria-hidden />
            <span>Open in UP mobile app</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href={tweetIntentUrl(app)} target="_blank" rel="noopener noreferrer">
            <XIcon className="h-4 w-4 text-text-secondary" />
            <span>Share on X</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={telegramShareUrl(app)} target="_blank" rel="noopener noreferrer">
            <TelegramIcon className="h-4 w-4 text-text-secondary" />
            <span>Share on Telegram</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={whatsappShareUrl(app)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="h-4 w-4 text-text-secondary" />
            <span>Share on WhatsApp</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
