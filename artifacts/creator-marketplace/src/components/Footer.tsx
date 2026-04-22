import { Link } from "wouter";
import { Flame } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base">
                Bharat<span className="text-primary">Creator</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India's creator economy platform connecting brands with authentic voices across Bharat.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Made with pride in India
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">For Creators</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/onboarding" className="hover:text-primary transition-colors">Join as Creator</Link></li>
              <li><Link href="/campaigns" className="hover:text-primary transition-colors">Browse Campaigns</Link></li>
              <li><Link href="/brands" className="hover:text-primary transition-colors">Find Brands</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">For Brands</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/onboarding" className="hover:text-primary transition-colors">Register Brand</Link></li>
              <li><Link href="/creators" className="hover:text-primary transition-colors">Discover Creators</Link></li>
              <li><Link href="/campaigns" className="hover:text-primary transition-colors">Post Campaign</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ["Fashion & Style", "Fashion"],
                ["Tech & Gaming", "Tech"],
                ["Food & Travel", "Food"],
                ["Beauty & Skincare", "Beauty"],
                ["Health & Fitness", "Health"],
              ].map(([full, label]) => (
                <li key={full}>
                  <Link
                    href={`/creators?category=${encodeURIComponent(full)}`}
                    className="hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BharatCreator. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
