import { useState } from "react";
import { Link } from "wouter";
import { Flame, Users, Briefcase, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCreateCreator, useCreateBrand } from "@workspace/api-client-react";
import { CATEGORIES, LANGUAGES, INDIAN_STATES } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Mode = "choose" | "creator" | "brand" | "success";

export default function OnboardingPage() {
  const [mode, setMode] = useState<Mode>("choose");
  const [successMsg, setSuccessMsg] = useState("");

  const createCreator = useCreateCreator();
  const createBrand = useCreateBrand();

  // Creator form
  const [cName, setCName] = useState("");
  const [cUsername, setCUsername] = useState("");
  const [cBio, setCBio] = useState("");
  const [cCategory, setCCategory] = useState("");
  const [cState, setCState] = useState("");
  const [cCity, setCCity] = useState("");
  const [cLanguages, setCLanguages] = useState<string[]>([]);

  // Brand form
  const [bName, setBName] = useState("");
  const [bIndustry, setBIndustry] = useState("");
  const [bDescription, setBDescription] = useState("");
  const [bWebsite, setBWebsite] = useState("");
  const [bEmail, setBEmail] = useState("");

  const toggleLanguage = (lang: string) => {
    setCLanguages((prev) => prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]);
  };

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cUsername || !cBio || !cCategory || !cState || !cCity || cLanguages.length === 0) return;
    await createCreator.mutateAsync({
      name: cName,
      username: cUsername,
      bio: cBio,
      category: cCategory,
      languages: cLanguages,
      state: cState,
      city: cCity,
      platforms: [{ platform: "instagram", handle: `@${cUsername}`, followers: 0, profileUrl: `https://instagram.com/${cUsername}` }],
      ratePerPost: 0,
      ratePerReel: 0,
      ratePerVideo: 0,
      tags: [cCategory.toLowerCase().replace(/ & /g, "-")],
    });
    setSuccessMsg("Your creator profile has been created! Brands can now discover you.");
    setMode("success");
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName || !bIndustry || !bDescription || !bWebsite || !bEmail) return;
    await createBrand.mutateAsync({
      name: bName,
      industry: bIndustry,
      description: bDescription,
      website: bWebsite,
      contactEmail: bEmail,
    });
    setSuccessMsg("Your brand profile is live! You can now post campaigns and discover creators.");
    setMode("success");
  };

  if (mode === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4">
        <div className="bg-card border border-card-border rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to BharatCreator!</h2>
          <p className="text-muted-foreground mb-6">{successMsg}</p>
          <div className="flex flex-col gap-3">
            <Link href="/creators"><Button className="w-full">Explore Creators</Button></Link>
            <Link href="/campaigns"><Button variant="outline" className="w-full">View Campaigns</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Bharat<span className="text-primary">Creator</span></span>
          </Link>
          {mode === "choose" && (
            <>
              <h1 className="text-3xl font-bold mb-2">Join BharatCreator</h1>
              <p className="text-muted-foreground">India's creator economy platform — free to join</p>
            </>
          )}
        </div>

        {mode === "choose" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <button onClick={() => setMode("creator")} className="bg-card border-2 border-border hover:border-primary rounded-2xl p-8 text-left transition-all group">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">I'm a Creator</h2>
              <p className="text-muted-foreground text-sm">Set up your creator profile, showcase your reach, and get discovered by top Indian brands.</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Instagram", "YouTube", "Moj"].map((p) => <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>)}
              </div>
            </button>
            <button onClick={() => setMode("brand")} className="bg-card border-2 border-border hover:border-secondary rounded-2xl p-8 text-left transition-all group">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <Briefcase className="w-7 h-7 text-secondary" />
              </div>
              <h2 className="text-xl font-bold mb-2">I'm a Brand</h2>
              <p className="text-muted-foreground text-sm">Register your brand, post campaigns, and connect with verified Indian creators across every niche.</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Post Campaigns", "Filter Creators", "Track Results"].map((p) => <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>)}
              </div>
            </button>
          </div>
        )}

        {mode === "creator" && (
          <div className="bg-card border border-card-border rounded-2xl p-6">
            <button onClick={() => setMode("choose")} className="flex items-center gap-2 text-sm text-muted-foreground mb-5 hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-xl font-bold mb-5">Create Your Creator Profile</h2>
            <form onSubmit={handleCreatorSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Priya Sharma" required />
                </div>
                <div>
                  <Label>Username *</Label>
                  <Input value={cUsername} onChange={(e) => setCUsername(e.target.value.toLowerCase().replace(/\s/g, ""))} placeholder="priyasharma" required />
                </div>
              </div>
              <div>
                <Label>Bio *</Label>
                <Textarea value={cBio} onChange={(e) => setCBio(e.target.value)} placeholder="Tell brands about yourself..." rows={3} required />
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={cCategory} onValueChange={setCCategory} required>
                  <SelectTrigger><SelectValue placeholder="Select your niche" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>State *</Label>
                  <Select value={cState} onValueChange={setCState} required>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>City *</Label>
                  <Input value={cCity} onChange={(e) => setCCity(e.target.value)} placeholder="Mumbai" required />
                </div>
              </div>
              <div>
                <Label>Content Languages * (select all that apply)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm border transition-colors",
                        cLanguages.includes(lang)
                          ? "bg-primary text-white border-primary"
                          : "border-border hover:border-primary hover:text-primary"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={createCreator.isPending}>
                {createCreator.isPending ? "Creating Profile..." : "Create Creator Profile"}
              </Button>
            </form>
          </div>
        )}

        {mode === "brand" && (
          <div className="bg-card border border-card-border rounded-2xl p-6">
            <button onClick={() => setMode("choose")} className="flex items-center gap-2 text-sm text-muted-foreground mb-5 hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-xl font-bold mb-5">Register Your Brand</h2>
            <form onSubmit={handleBrandSubmit} className="space-y-4">
              <div>
                <Label>Brand Name *</Label>
                <Input value={bName} onChange={(e) => setBName(e.target.value)} placeholder="Mamaearth" required />
              </div>
              <div>
                <Label>Industry *</Label>
                <Select value={bIndustry} onValueChange={setBIndustry} required>
                  <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    {["Personal Care & Beauty", "Consumer Electronics", "Beauty & Fashion", "Food & Beverage", "Fashion & Eyewear", "Health & Wellness", "Finance & Fintech", "EdTech", "E-commerce", "Retail", "Automotive", "Real Estate"].map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Brand Description *</Label>
                <Textarea value={bDescription} onChange={(e) => setBDescription(e.target.value)} placeholder="Tell creators about your brand..." rows={3} required />
              </div>
              <div>
                <Label>Website *</Label>
                <Input value={bWebsite} onChange={(e) => setBWebsite(e.target.value)} placeholder="https://yourbrand.com" type="url" required />
              </div>
              <div>
                <Label>Contact Email *</Label>
                <Input value={bEmail} onChange={(e) => setBEmail(e.target.value)} placeholder="partnerships@yourbrand.com" type="email" required />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={createBrand.isPending}>
                {createBrand.isPending ? "Registering..." : "Register Brand"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
