import { useParams, Link } from "wouter";
import { ArrowLeft, MapPin, Star, Globe, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCreator, getGetCreatorQueryKey } from "@workspace/api-client-react";
import { formatFollowers, formatINR, PLATFORM_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const bgColors = ["bg-orange-400", "bg-teal-500", "bg-purple-500", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-red-400", "bg-indigo-500"];
function getAvatarBg(name: string) {
  return bgColors[name.charCodeAt(0) % bgColors.length];
}
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function CreatorDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0", 10);

  const { data: creator, isLoading, error } = useGetCreator(id, {
    query: { enabled: !!id, queryKey: getGetCreatorQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-8 w-24 mb-6" />
        <div className="bg-card border border-card-border rounded-2xl p-8">
          <div className="flex gap-5 mb-6">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-20 w-full mb-6" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">Creator not found.</p>
        <Link href="/creators"><Button variant="outline" className="mt-4">Back to Creators</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/creators">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Creators
        </Button>
      </Link>

      {/* Header */}
      <div className="bg-card border border-card-border rounded-2xl p-6 mb-5">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className={cn("w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0", getAvatarBg(creator.name))}>
            {creator.profileImageUrl ? (
              <img src={creator.profileImageUrl} alt={creator.name} className="w-full h-full rounded-full object-cover" />
            ) : getInitials(creator.name)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{creator.name}</h1>
              {creator.verified && <Star className="w-5 h-5 text-primary fill-primary" />}
              <Badge className="bg-primary/10 text-primary">{creator.category}</Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-2">@{creator.username}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{creator.city}, {creator.state}</span>
              <div className="flex flex-wrap gap-1.5">
                {creator.languages.map((lang) => (
                  <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button size="sm">Contact Creator</Button>
            <Button variant="outline" size="sm">Share Profile</Button>
          </div>
        </div>

        <Separator className="my-5" />

        <p className="text-muted-foreground leading-relaxed">{creator.bio}</p>

        {creator.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {creator.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total Followers", value: formatFollowers(creator.totalFollowers) },
          { label: "Engagement Rate", value: `${creator.engagementRate.toFixed(1)}%` },
          { label: "Avg Views", value: formatFollowers(creator.avgViews) },
          { label: "Rate/Reel", value: formatINR(creator.ratePerReel) },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-card-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Platforms */}
      <div className="bg-card border border-card-border rounded-2xl p-6 mb-5">
        <h2 className="font-semibold mb-4">Platforms</h2>
        <div className="space-y-3">
          {creator.platforms.map((p: { platform: string; handle: string; followers: number; profileUrl: string }) => (
            <div key={p.platform} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium capitalize", PLATFORM_COLORS[p.platform] || "bg-muted text-muted-foreground")}>
                  {p.platform}
                </span>
                <span className="text-sm text-muted-foreground">{p.handle}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm">{formatFollowers(p.followers)} followers</span>
                <a href={p.profileUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                  <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rates */}
      <div className="bg-card border border-card-border rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Collaboration Rates</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Static Post", value: formatINR(creator.ratePerPost) },
            { label: "Reel / Short", value: formatINR(creator.ratePerReel) },
            { label: "YouTube Video", value: formatINR(creator.ratePerVideo) },
          ].map((rate) => (
            <div key={rate.label} className="text-center p-4 border border-border rounded-xl">
              <p className="text-xl font-bold text-primary">{rate.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{rate.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button className="w-full" size="lg">Send Collaboration Request</Button>
        </div>
      </div>
    </div>
  );
}
