import { Link } from "wouter";
import { Flame, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg">Bharat<span className="text-primary">Creator</span></span>
      </Link>
      <p className="text-8xl font-extrabold text-primary/20 mb-4">404</p>
      <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-xs">
        This page doesn't exist. Let's get you back to discovering creators and campaigns.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
        <Link href="/creators">
          <Button variant="outline">Browse Creators</Button>
        </Link>
      </div>
    </div>
  );
}
