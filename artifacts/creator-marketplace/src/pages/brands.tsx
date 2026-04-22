import { useState } from "react";
import { Search, X, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useListBrands } from "@workspace/api-client-react";
import { formatINR, cn } from "@/lib/utils";

const INDUSTRIES = [
  "Personal Care & Beauty", "Consumer Electronics", "Beauty & Fashion",
  "Food & Beverage", "Fashion & Eyewear", "Health & Wellness",
  "Finance & Fintech", "EdTech", "E-commerce",
];

const avatarColors = ["bg-teal-600", "bg-blue-600", "bg-purple-600", "bg-orange-500", "bg-green-600", "bg-pink-500"];

function BrandLogo({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  if (logoUrl) return <img src={logoUrl} alt={name} className="w-14 h-14 rounded-xl object-contain border border-border bg-white" />;
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const bg = avatarColors[name.charCodeAt(0) % avatarColors.length];
  return <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg", bg)}>{initials}</div>;
}

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");

  const { data: brands, isLoading } = useListBrands({
    ...(search && { search }),
    ...(industry && { industry }),
  });

  const hasFilters = !!(search || industry);
  const clearFilters = () => { setSearch(""); setIndustry(""); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Brand Partners</h1>
        <p className="text-muted-foreground">Discover India's top brands actively looking for creators</p>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-4 mb-8">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search brands..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={industry || "all"} onValueChange={(v) => setIndustry(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
              <X className="w-4 h-4" /> Clear
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-5">
        {isLoading ? "Loading..." : `${brands?.length || 0} brands found`}
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : brands && brands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((brand) => (
            <Link key={brand.id} href={`/brands/${brand.id}`}>
              <div className="bg-card border border-card-border rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer h-full flex flex-col">
                <div className="flex items-start gap-4 mb-3">
                  <BrandLogo name={brand.name} logoUrl={brand.logoUrl} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-bold text-base truncate">{brand.name}</h3>
                      {brand.verified && <Badge className="text-xs bg-primary/10 text-primary px-1.5">Verified</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{brand.industry}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">{brand.description}</p>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                  <div className="text-center">
                    <p className="text-sm font-bold">{brand.totalCampaigns}</p>
                    <p className="text-xs text-muted-foreground">Campaigns</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-green-600">{brand.activeCampaigns}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-primary">{formatINR(brand.totalSpent)}</p>
                    <p className="text-xs text-muted-foreground">Spent</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No brands found</p>
          {hasFilters && <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>Clear Filters</Button>}
        </div>
      )}
    </div>
  );
}
