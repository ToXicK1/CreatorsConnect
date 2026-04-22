import { Link } from "wouter";
import { MapPin, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatFollowers, formatINR, PLATFORM_COLORS } from "@/lib/utils";

interface PlatformStat {
  platform: string;
  handle: string;
  followers: number;
  profileUrl: string;
}

interface Creator {
  id: number;
  name: string;
  username: string;
  bio: string;
  profileImageUrl?: string | null;
  category: string;
  languages: string[];
  state: string;
  city: string;
  platforms: PlatformStat[];
  totalFollowers: number;
  engagementRate: number;
  avgViews: number;
  ratePerPost: number;
  ratePerReel: number;
  verified: boolean;
  tags: string[];
}

interface CreatorCardProps {
  creator: Creator;
  compact?: boolean;
}

const categoryColors: Record<string, string> = {
  "Fashion & Style": "bg-pink-100 text-pink-700",
  "Tech & Gaming": "bg-blue-100 text-blue-700",
  "Food & Travel": "bg-orange-100 text-orange-700",
  "Health & Fitness": "bg-green-100 text-green-700",
  "Beauty & Skincare": "bg-purple-100 text-purple-700",
  "Finance & Business": "bg-teal-100 text-teal-700",
  "Entertainment": "bg-yellow-100 text-yellow-700",
  "Comedy": "bg-red-100 text-red-700",
  "Education & Career": "bg-indigo-100 text-indigo-700",
  "Lifestyle": "bg-rose-100 text-rose-700",
  "Sports": "bg-lime-100 text-lime-700",
  "Devotional": "bg-amber-100 text-amber-700",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const bgColors = [
  "bg-orange-400", "bg-teal-500", "bg-purple-500", "bg-pink-500",
  "bg-blue-500", "bg-green-500", "bg-red-400", "bg-indigo-500",
];

function getAvatarBg(name: string) {
  const idx = name.charCodeAt(0) % bgColors.length;
  return bgColors[idx];
}

export function CreatorCard({ creator, compact }: CreatorCardProps) {
  const primaryPlatform = creator.platforms[0];

  return (
    <Link href={`/creators/${creator.id}`}>
      <div className="bg-card border border-card-border rounded-xl p-4 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0",
              getAvatarBg(creator.name)
            )}
          >
            {creator.profileImageUrl ? (
              <img
                src={creator.profileImageUrl}
                alt={creator.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(creator.name)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-sm truncate">{creator.name}</p>
              {creator.verified && (
                <Star className="w-3.5 h-3.5 text-primary fill-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">@{creator.username}</p>
          </div>
          <Badge
            className={cn(
              "text-xs flex-shrink-0",
              categoryColors[creator.category] || "bg-muted text-muted-foreground"
            )}
            variant="secondary"
          >
            {creator.category.split(" ")[0]}
          </Badge>
        </div>

        {!compact && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{creator.bio}</p>
        )}

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <p className="text-sm font-bold text-foreground">{formatFollowers(creator.totalFollowers)}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <p className="text-sm font-bold text-foreground">{creator.engagementRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Engagement</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <p className="text-sm font-bold text-foreground">{formatFollowers(creator.avgViews)}</p>
            <p className="text-xs text-muted-foreground">Avg Views</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {creator.platforms.slice(0, 3).map((p) => (
            <span
              key={p.platform}
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
                PLATFORM_COLORS[p.platform] || "bg-muted text-muted-foreground"
              )}
            >
              {p.platform}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <MapPin className="w-3 h-3" />
            <span>{creator.city}</span>
          </div>
          <div className="text-xs font-semibold text-primary">
            {formatINR(creator.ratePerReel)}/reel
          </div>
        </div>
      </div>
    </Link>
  );
}
