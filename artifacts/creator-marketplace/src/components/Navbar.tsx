import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Flame } from "lucide-react";

const navLinks = [
  { href: "/creators", label: "Creators" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/brands", label: "Brands" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Flame className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Bharat<span className="text-primary">Creator</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/onboarding">
              <Button size="sm" variant="outline">Sign In</Button>
            </Link>
            <Link href="/onboarding">
              <Button size="sm">Join Free</Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium",
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex gap-2">
              <Link href="/onboarding" className="flex-1">
                <Button size="sm" variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/onboarding" className="flex-1">
                <Button size="sm" className="w-full">Join Free</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
