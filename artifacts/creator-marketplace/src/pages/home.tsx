import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, Users, Briefcase, TrendingUp, Star, Search, Flame,
  Shirt, Cpu, UtensilsCrossed, Dumbbell, Sparkles, BarChart2,
  Clapperboard, GraduationCap, Leaf, Laugh, Trophy, Sun, type LucideProps,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreatorCard } from "@/components/CreatorCard";
import { CampaignCard } from "@/components/CampaignCard";
import {
  useGetPlatformStats,
  useGetTopCreators,
  useGetTrendingCampaigns,
  useGetCategoryBreakdown,
} from "@workspace/api-client-react";
import { formatFollowers, CATEGORIES } from "@/lib/utils";
import { useState } from "react";
import { useLocation } from "wouter";
import { type FC } from "react";

const categoryIcons: Record<string, FC<LucideProps>> = {
  "Fashion & Style": Shirt,
  "Tech & Gaming": Cpu,
  "Food & Travel": UtensilsCrossed,
  "Health & Fitness": Dumbbell,
  "Beauty & Skincare": Sparkles,
  "Finance & Business": BarChart2,
  "Entertainment": Clapperboard,
  "Education & Career": GraduationCap,
  "Lifestyle": Leaf,
  "Comedy": Laugh,
  "Sports": Trophy,
  "Devotional": Sun,
};

const QUICK_CATEGORIES: [string, string][] = [
  ["Fashion & Style", "Fashion"],
  ["Tech & Gaming", "Tech"],
  ["Food & Travel", "Food"],
  ["Beauty & Skincare", "Beauty"],
  ["Finance & Business", "Finance"],
];

function CategoryIcon({ name }: { name: string }) {
  const Icon = categoryIcons[name] ?? Star;
  return (
    <div className="flex justify-center mb-1.5">
      <Icon className="w-5 h-5 text-primary" />
    </div>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  const { data: stats } = useGetPlatformStats();
  const { data: topCreators } = useGetTopCreators({ limit: 8 });
  const { data: trendingCampaigns } = useGetTrendingCampaigns({ limit: 6 });
  const { data: categoryBreakdown } = useGetCategoryBreakdown();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/creators?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const statItems = [
    { label: "Verified Creators", value: stats ? formatFollowers(stats.totalCreators) + "+" : "50K+", icon: Users },
    { label: "Brand Partners", value: stats ? formatFollowers(stats.totalBrands) + "+" : "2K+", icon: Briefcase },
    { label: "Active Campaigns", value: stats ? String(stats.openCampaigns) : "500+", icon: TrendingUp },
    { label: "Total Reach", value: stats ? stats.totalReachCrore + " Cr+" : "200 Cr+", icon: Star },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-16 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1">
              <Flame className="w-3 h-3 mr-1" />
              India's Creator Economy Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-5">
              Connect Indian Creators
              <span className="text-primary"> with Brands</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              The marketplace built for Bharat's creators — from Mumbai to Madurai, Hindi to Malayalam. Find collaborations that resonate with real India.
            </p>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search creators, categories, languages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_CATEGORIES.map(([full, label]) => (
                <Link key={full} href={`/creators?category=${encodeURIComponent(full)}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    {label}
                  </Badge>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-foreground">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Campaigns */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Trending Campaigns</h2>
              <p className="text-muted-foreground text-sm mt-1">Active opportunities from top Indian brands</p>
            </div>
            <Link href="/campaigns">
              <Button variant="outline" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          {trendingCampaigns && trendingCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trendingCampaigns.map((campaign, i) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <CampaignCard campaign={campaign} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No campaigns yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Top Creators */}
      <section className="py-14 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Top Creators</h2>
              <p className="text-muted-foreground text-sm mt-1">India's most influential content creators</p>
            </div>
            <Link href="/creators">
              <Button variant="outline" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          {topCreators && topCreators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topCreators.map((creator, i) => (
                <motion.div
                  key={creator.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <CreatorCard creator={creator} compact />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No creators yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <p className="text-muted-foreground text-sm mt-1">Find creators in every niche</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat, i) => {
              const count = categoryBreakdown?.find((c) => c.category === cat)?.count || 0;
              return (
                <Link key={cat} href={`/creators?category=${encodeURIComponent(cat)}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-3 bg-card border border-card-border rounded-xl text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <CategoryIcon name={cat} />
                    <p className="text-xs font-medium leading-tight">{cat}</p>
                    {count > 0 && <p className="text-xs text-muted-foreground mt-0.5">{count} creators</p>}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to grow with Bharat's best brands?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Join thousands of Indian creators who found their perfect brand collaborations here.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/onboarding">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                I'm a Creator
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                I'm a Brand
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
