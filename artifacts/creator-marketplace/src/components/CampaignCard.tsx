import { Link } from "wouter";
import { Calendar, Users, BadgeIndianRupee, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatINR, formatDate, PLATFORM_COLORS } from "@/lib/utils";

interface Campaign {
  id: number;
  brandId: number;
  brandName: string;
  brandLogoUrl?: string | null;
  title: string;
  description: string;
  category: string;
  platforms: string[];
  budget: number;
  budgetType: string;
  targetLanguages: string[];
  targetStates: string[];
  minFollowers: number;
  deadline: string;
  status: string;
  applicationCount: number;
  createdAt: string;
}

interface CampaignCardProps {
  campaign: Campaign;
}

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  closed: "bg-red-100 text-red-700",
  completed: "bg-gray-100 text-gray-600",
  draft: "bg-yellow-100 text-yellow-700",
};

const categoryColors: Record<string, string> = {
  "Fashion & Style": "bg-pink-100 text-pink-700",
  "Tech & Gaming": "bg-blue-100 text-blue-700",
  "Food & Travel": "bg-orange-100 text-orange-700",
  "Health & Fitness": "bg-green-100 text-green-700",
  "Beauty & Skincare": "bg-purple-100 text-purple-700",
  "Finance & Business": "bg-teal-100 text-teal-700",
  "Entertainment": "bg-yellow-100 text-yellow-700",
  "Comedy": "bg-red-100 text-red-700",
};

function BrandAvatar({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  if (logoUrl) {
    return <img src={logoUrl} alt={name} className="w-10 h-10 rounded-lg object-contain bg-white border border-border" />;
  }
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["bg-teal-600", "bg-blue-600", "bg-purple-600", "bg-orange-500", "bg-green-600"];
  const bg = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm", bg)}>
      {initials}
    </div>
  );
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const deadlinePassed = new Date(campaign.deadline) < new Date();

  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <div className="bg-card border border-card-border rounded-xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <BrandAvatar name={campaign.brandName} logoUrl={campaign.brandLogoUrl} />
            <div>
              <p className="text-xs text-muted-foreground">{campaign.brandName}</p>
              <h3 className="font-semibold text-sm leading-tight line-clamp-2">{campaign.title}</h3>
            </div>
          </div>
          <Badge
            className={cn("text-xs flex-shrink-0", statusColors[campaign.status] || "bg-muted text-muted-foreground")}
            variant="secondary"
          >
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{campaign.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge
            variant="secondary"
            className={cn("text-xs", categoryColors[campaign.category] || "bg-muted text-muted-foreground")}
          >
            {campaign.category}
          </Badge>
          {campaign.platforms.slice(0, 2).map((p) => (
            <span
              key={p}
              className={cn("text-xs px-2 py-0.5 rounded-full font-medium capitalize", PLATFORM_COLORS[p] || "bg-muted text-muted-foreground")}
            >
              {p}
            </span>
          ))}
          {campaign.platforms.length > 2 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{campaign.platforms.length - 2}</span>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BadgeIndianRupee className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-foreground">{formatINR(campaign.budget)}</span>
            <span className="text-muted-foreground">/{campaign.budgetType === "per_creator" ? "creator" : campaign.budgetType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground justify-end">
            <Users className="w-3.5 h-3.5" />
            <span>{campaign.applicationCount} applied</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Target className="w-3.5 h-3.5" />
            <span>{Number(campaign.minFollowers).toLocaleString("en-IN")}+ followers</span>
          </div>
          <div className={cn("flex items-center gap-1.5 text-xs justify-end", deadlinePassed ? "text-red-500" : "text-muted-foreground")}>
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(campaign.deadline)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
