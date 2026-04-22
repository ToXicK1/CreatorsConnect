import { useParams, Link } from "wouter";
import { ArrowLeft, Globe, Mail, Star, Briefcase, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBrand, useListCampaigns, getGetBrandQueryKey } from "@workspace/api-client-react";
import { formatINR, cn } from "@/lib/utils";
import { CampaignCard } from "@/components/CampaignCard";

const avatarColors = ["bg-teal-600", "bg-blue-600", "bg-purple-600", "bg-orange-500", "bg-green-600"];

export default function BrandDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0", 10);

  const { data: brand, isLoading, error } = useGetBrand(id, {
    query: { enabled: !!id, queryKey: getGetBrandQueryKey(id) }
  });

  const { data: campaigns } = useListCampaigns({ brandId: id }, {
    query: { enabled: !!id }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Skeleton className="h-8 w-24 mb-6" />
        <Skeleton className="h-48 rounded-2xl mb-5" />
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">Brand not found.</p>
        <Link href="/brands"><Button variant="outline" className="mt-4">Back to Brands</Button></Link>
      </div>
    );
  }

  const bg = avatarColors[brand.name.charCodeAt(0) % avatarColors.length];
  const initials = brand.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/brands">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Brands
        </Button>
      </Link>

      <div className="bg-card border border-card-border rounded-2xl p-6 mb-5">
        <div className="flex flex-col sm:flex-row gap-5">
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.name} className="w-20 h-20 rounded-xl object-contain border border-border" />
          ) : (
            <div className={cn("w-20 h-20 rounded-xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0", bg)}>
              {initials}
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{brand.name}</h1>
              {brand.verified && <Badge className="bg-primary/10 text-primary text-xs">Verified Brand</Badge>}
            </div>
            <p className="text-muted-foreground text-sm mb-3">{brand.industry}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{brand.description}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <a href={brand.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                <Globe className="w-4 h-4" />{brand.website}
              </a>
              <a href={`mailto:${brand.contactEmail}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                <Mail className="w-4 h-4" />{brand.contactEmail}
              </a>
            </div>
          </div>
          <div>
            <Button>Contact Brand</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-card border border-card-border rounded-xl p-4 text-center">
          <Briefcase className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-xl font-bold">{brand.totalCampaigns}</p>
          <p className="text-xs text-muted-foreground">Total Campaigns</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4 text-center">
          <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-500" />
          <p className="text-xl font-bold text-green-600">{brand.activeCampaigns}</p>
          <p className="text-xs text-muted-foreground">Active Now</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4 text-center">
          <Star className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-xl font-bold text-primary">{formatINR(brand.totalSpent)}</p>
          <p className="text-xs text-muted-foreground">Total Invested</p>
        </div>
      </div>

      {campaigns && campaigns.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-4">Active Campaigns</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
          </div>
        </div>
      )}
    </div>
  );
}
