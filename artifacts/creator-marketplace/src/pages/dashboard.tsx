import { Users, Briefcase, TrendingUp, Star, ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetPlatformStats,
  useGetTopCreators,
  useGetTrendingCampaigns,
  useListApplications,
} from "@workspace/api-client-react";
import { formatFollowers, formatINR, cn } from "@/lib/utils";

const statColors = [
  "from-orange-400 to-orange-600",
  "from-teal-500 to-teal-700",
  "from-purple-500 to-purple-700",
  "from-pink-500 to-pink-700",
];

const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
  accepted: { color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { color: "bg-red-100 text-red-700", icon: XCircle },
  completed: { color: "bg-blue-100 text-blue-700", icon: Star },
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetPlatformStats();
  const { data: topCreators } = useGetTopCreators({ limit: 5 });
  const { data: trendingCampaigns } = useGetTrendingCampaigns({ limit: 4 });
  const { data: recentApplications } = useListApplications({});

  const statItems = [
    { label: "Total Creators", value: stats?.totalCreators || 0, icon: Users, gradient: statColors[0] },
    { label: "Brand Partners", value: stats?.totalBrands || 0, icon: Briefcase, gradient: statColors[1] },
    { label: "Open Campaigns", value: stats?.openCampaigns || 0, icon: TrendingUp, gradient: statColors[2] },
    { label: "Collaborations Done", value: stats?.totalCollaborations || 0, icon: Star, gradient: statColors[3] },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Platform Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of Bharat Creator Hub</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statItems.map((stat, i) => (
          <div key={stat.label} className={cn("rounded-2xl p-5 bg-gradient-to-br text-white", stat.gradient)}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-6 h-6 opacity-80" />
              <span className="text-xs opacity-70">Live</span>
            </div>
            {statsLoading ? (
              <Skeleton className="h-8 w-20 bg-white/30 mb-1" />
            ) : (
              <p className="text-3xl font-extrabold">{formatFollowers(stat.value)}</p>
            )}
            <p className="text-xs opacity-80 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-card border border-card-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-1">Total Creator Reach</p>
            <p className="text-2xl font-bold text-primary">{stats.totalReachCrore} Crore+</p>
            <p className="text-xs text-muted-foreground mt-1">Combined followers across all creators</p>
          </div>
          <div className="bg-card border border-card-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-1">Platform Avg Engagement</p>
            <p className="text-2xl font-bold text-teal-600">{stats.averageEngagementRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Average across all creator profiles</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Creators */}
        <div className="lg:col-span-1 bg-card border border-card-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Top Creators</h2>
            <Link href="/creators"><Button variant="ghost" size="sm" className="text-xs gap-1">View All <ArrowRight className="w-3 h-3" /></Button></Link>
          </div>
          <div className="space-y-3">
            {topCreators?.map((creator, i) => {
              const bgColors = ["bg-orange-400", "bg-teal-500", "bg-purple-500", "bg-pink-500", "bg-blue-500"];
              const bg = bgColors[creator.name.charCodeAt(0) % bgColors.length];
              const initials = creator.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
              return (
                <Link key={creator.id} href={`/creators/${creator.id}`}>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <span className="text-xs text-muted-foreground w-4 text-center">{i + 1}</span>
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0", bg)}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{creator.name}</p>
                      <p className="text-xs text-muted-foreground">{creator.category}</p>
                    </div>
                    <p className="text-xs font-semibold text-primary whitespace-nowrap">{formatFollowers(creator.totalFollowers)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Trending Campaigns */}
        <div className="lg:col-span-1 bg-card border border-card-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Hot Campaigns</h2>
            <Link href="/campaigns"><Button variant="ghost" size="sm" className="text-xs gap-1">View All <ArrowRight className="w-3 h-3" /></Button></Link>
          </div>
          <div className="space-y-3">
            {trendingCampaigns?.map((campaign) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                <div className="p-3 border border-border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                  <p className="text-sm font-medium line-clamp-1">{campaign.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{campaign.brandName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-semibold text-primary">{formatINR(campaign.budget)}</span>
                    <span className="text-xs text-muted-foreground">{campaign.applicationCount} applied</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="lg:col-span-1 bg-card border border-card-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Applications</h2>
          </div>
          {recentApplications && recentApplications.length > 0 ? (
            <div className="space-y-3">
              {recentApplications.slice(0, 5).map((app) => {
                const cfg = statusConfig[app.status] || statusConfig.pending;
                const StatusIcon = cfg.icon;
                return (
                  <div key={app.id} className="p-3 border border-border rounded-xl">
                    <p className="text-sm font-medium line-clamp-1">{app.campaignTitle}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">by {app.creatorName}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <StatusIcon className="w-3.5 h-3.5" />
                      <Badge className={cn("text-xs", cfg.color)} variant="secondary">
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No applications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
