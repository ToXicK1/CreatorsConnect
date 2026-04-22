import { useState } from "react";
import { Search, X, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampaignCard } from "@/components/CampaignCard";
import { useListCampaigns } from "@workspace/api-client-react";
import { CATEGORIES, PLATFORMS } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [minBudget, setMinBudget] = useState("");

  const params = {
    ...(search && { search }),
    ...(status && { status: status as "open" | "closed" | "completed" | "draft" }),
    ...(category && { category }),
    ...(platform && { platform }),
    ...(minBudget && { minBudget: Number(minBudget) }),
  };

  const { data: campaigns, isLoading } = useListCampaigns(params);

  const hasFilters = !!(search || status || category || platform || minBudget);

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setCategory("");
    setPlatform("");
    setMinBudget("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Brand Campaigns</h1>
        <p className="text-muted-foreground">Discover collaboration opportunities from India's top brands</p>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-4 mb-8">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={status || "all"} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={platform || "all"} onValueChange={(v) => setPlatform(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {PLATFORMS.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={minBudget || "any"} onValueChange={(v) => setMinBudget(v === "any" ? "" : v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Min Budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Budget</SelectItem>
              <SelectItem value="10000">₹10K+</SelectItem>
              <SelectItem value="25000">₹25K+</SelectItem>
              <SelectItem value="50000">₹50K+</SelectItem>
              <SelectItem value="100000">₹1L+</SelectItem>
              <SelectItem value="500000">₹5L+</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
              <X className="w-4 h-4" /> Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${campaigns?.length || 0} campaigns found`}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No campaigns found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
          {hasFilters && <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>Clear Filters</Button>}
        </div>
      )}
    </div>
  );
}
