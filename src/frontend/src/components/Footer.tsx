import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-primary py-6 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-primary-foreground/70 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-display text-primary-foreground font-semibold">
            She Safe
          </span>
          <span>— Your safety companion</span>
        </div>
        <p className="flex items-center gap-1">
          © {year}. Built with{" "}
          <Heart className="h-3.5 w-3.5 fill-current text-destructive" /> using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-foreground hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
