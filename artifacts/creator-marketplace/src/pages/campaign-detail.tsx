import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, Users, BadgeIndianRupee, Target, MapPin, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCampaign, getGetCampaignQueryKey } from "@workspace/api-client-react";
import { formatINR, formatDate, PLATFORM_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";

function BrandAvatar({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  if (logoUrl) return <img src={logoUrl} alt={name} className="w-16 h-16 rounded-xl object-contain bg-white border border-border" />;
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["bg-teal-600", "bg-blue-600", "bg-purple-600", "bg-orange-500", "bg-green-600"];
  const bg = colors[name.charCodeAt(0) % colors.length];
  return <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg", bg)}>{initials}</div>;
}

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0", 10);

  const { data: campaign, isLoading, error } = useGetCampaign(id, {
    query: { enabled: !!id, queryKey: getGetCampaignQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Skeleton className="h-8 w-24 mb-6" />
        <Skeleton className="h-48 rounded-2xl mb-5" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">Campaign not found.</p>
        <Link href="/campaigns"><Button variant="outline" className="mt-4">Back to Campaigns</Button></Link>
      </div>
    );
  }

  const deadlinePassed = new Date(campaign.deadline) < new Date();
  const isOpen = campaign.status === "open" && !deadlinePassed;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/campaigns">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Campaigns
        </Button>
      </Link>

      {/* Header */}
      <div className="bg-card border border-card-border rounded-2xl p-6 mb-5">
        <div className="flex flex-col sm:flex-row gap-5 mb-5">
          <BrandAvatar name={campaign.brandName} logoUrl={campaign.brandLogoUrl} />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{campaign.brandName}</p>
            <h1 className="text-2xl font-bold mb-2">{campaign.title}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge className={cn("text-xs", campaign.status === "open" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground")} variant="secondary">
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Badge>
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">{campaign.category}</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {isOpen ? (
              <Button size="lg">Apply Now</Button>
            ) : (
              <Button size="lg" disabled>Applications Closed</Button>
            )}
            <Button variant="outline" size="sm">Save Campaign</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/40 rounded-xl">
            <p className="text-lg font-bold text-primary">{formatINR(campaign.budget)}</p>
            <p className="text-xs text-muted-foreground">{campaign.budgetType === "per_creator" ? "Per Creator" : campaign.budgetType === "negotiable" ? "Negotiable" : "Fixed Budget"}</p>
          </div>
          <div className="text-center p-3 bg-muted/40 rounded-xl">
            <p className="text-lg font-bold">{campaign.applicationCount}</p>
            <p className="text-xs text-muted-foreground">Applications</p>
          </div>
          <div className="text-center p-3 bg-muted/40 rounded-xl">
            <p className="text-lg font-bold">{Number(campaign.minFollowers).toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground">Min Followers</p>
          </div>
          <div className={cn("text-center p-3 bg-muted/40 rounded-xl", deadlinePassed && "bg-red-50")}>
            <p className={cn("text-sm font-bold", deadlinePassed && "text-red-500")}>{formatDate(campaign.deadline)}</p>
            <p className="text-xs text-muted-foreground">Deadline</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="sm:col-span-2 space-y-5">
          {/* Description */}
          <div className="bg-card border border-card-border rounded-2xl p-6">
            <h2 className="font-semibold mb-3">About this Campaign</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{campaign.description}</p>
          </div>

          {/* Brief */}
          <div className="bg-card border border-card-border rounded-2xl p-6">
            <h2 className="font-semibold mb-3">Campaign Brief</h2>
            <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">{campaign.brief}</p>
          </div>

          {/* Deliverables */}
          <div className="bg-card border border-card-border rounded-2xl p-6">
            <h2 className="font-semibold mb-3">Deliverables Required</h2>
            <ul className="space-y-2">
              {campaign.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          {/* Platforms */}
          <div className="bg-card border border-card-border rounded-2xl p-5">
            <h3 className="font-semibold mb-3 text-sm">Required Platforms</h3>
            <div className="flex flex-wrap gap-1.5">
              {campaign.platforms.map((p) => (
                <span key={p} className={cn("text-xs px-2.5 py-1 rounded-full font-medium capitalize", PLATFORM_COLORS[p] || "bg-muted text-muted-foreground")}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Target Languages */}
          {campaign.targetLanguages.length > 0 && (
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <h3 className="font-semibold mb-3 text-sm">Target Languages</h3>
              <div className="flex flex-wrap gap-1.5">
                {campaign.targetLanguages.map((lang) => (
                  <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Target States */}
          {campaign.targetStates.length > 0 && (
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <h3 className="font-semibold mb-3 text-sm">Target States</h3>
              <div className="flex flex-wrap gap-1.5">
                {campaign.targetStates.map((state) => (
                  <Badge key={state} variant="secondary" className="text-xs">{state}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Apply */}
          {isOpen && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <h3 className="font-semibold mb-2 text-sm text-primary">Interested?</h3>
              <p className="text-xs text-muted-foreground mb-3">Submit your application with a pitch and proposed rate.</p>
              <Button className="w-full">Apply to Campaign</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
