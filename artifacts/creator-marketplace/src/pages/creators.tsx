import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreatorCard } from "@/components/CreatorCard";
import { useListCreators } from "@workspace/api-client-react";
import { CATEGORIES, LANGUAGES, PLATFORMS, INDIAN_STATES } from "@/lib/utils";
import { useSearch } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreatorsPage() {
  const searchParams = new URLSearchParams(useSearch());

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [language, setLanguage] = useState("");
  const [platform, setPlatform] = useState("");
  const [state, setState] = useState("");
  const [minFollowers, setMinFollowers] = useState("");

  const params = {
    ...(search && { search }),
    ...(category && { category }),
    ...(language && { language }),
    ...(platform && { platform }),
    ...(state && { state }),
    ...(minFollowers && { minFollowers: Number(minFollowers) }),
  };

  const { data: creators, isLoading } = useListCreators(params);

  const hasFilters = !!(search || category || language || platform || state || minFollowers);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLanguage("");
    setPlatform("");
    setState("");
    setMinFollowers("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Creators</h1>
        <p className="text-muted-foreground">Find the perfect creator for your brand across India</p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-card-border rounded-xl p-4 mb-8">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={language || "all"} onValueChange={(v) => setLanguage(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {LANGUAGES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
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
          <Select value={state || "all"} onValueChange={(v) => setState(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={minFollowers || "any"} onValueChange={(v) => setMinFollowers(v === "any" ? "" : v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Min Followers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Followers</SelectItem>
              <SelectItem value="10000">10K+</SelectItem>
              <SelectItem value="50000">50K+</SelectItem>
              <SelectItem value="100000">1L+</SelectItem>
              <SelectItem value="500000">5L+</SelectItem>
              <SelectItem value="1000000">10L+</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
              <X className="w-4 h-4" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${creators?.length || 0} creators found`}
        </p>
        {hasFilters && (
          <div className="flex flex-wrap gap-1.5">
            {category && <Badge variant="secondary" className="gap-1">{category} <button onClick={() => setCategory("")}><X className="w-3 h-3" /></button></Badge>}
            {language && <Badge variant="secondary" className="gap-1">{language} <button onClick={() => setLanguage("")}><X className="w-3 h-3" /></button></Badge>}
            {platform && <Badge variant="secondary" className="gap-1 capitalize">{platform} <button onClick={() => setPlatform("")}><X className="w-3 h-3" /></button></Badge>}
            {state && <Badge variant="secondary" className="gap-1">{state} <button onClick={() => setState("")}><X className="w-3 h-3" /></button></Badge>}
          </div>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : creators && creators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <SlidersHorizontal className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No creators found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
          {hasFilters && (
            <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
