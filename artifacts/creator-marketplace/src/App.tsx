import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import CreatorsPage from "@/pages/creators";
import CreatorDetailPage from "@/pages/creator-detail";
import CampaignsPage from "@/pages/campaigns";
import CampaignDetailPage from "@/pages/campaign-detail";
import BrandsPage from "@/pages/brands";
import BrandDetailPage from "@/pages/brand-detail";
import DashboardPage from "@/pages/dashboard";
import OnboardingPage from "@/pages/onboarding";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
    },
  },
});

function WithNavbar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <WithNavbar><HomePage /></WithNavbar>} />
      <Route path="/creators" component={() => <WithNavbar><CreatorsPage /></WithNavbar>} />
      <Route path="/creators/:id" component={() => <WithNavbar><CreatorDetailPage /></WithNavbar>} />
      <Route path="/campaigns" component={() => <WithNavbar><CampaignsPage /></WithNavbar>} />
      <Route path="/campaigns/:id" component={() => <WithNavbar><CampaignDetailPage /></WithNavbar>} />
      <Route path="/brands" component={() => <WithNavbar><BrandsPage /></WithNavbar>} />
      <Route path="/brands/:id" component={() => <WithNavbar><BrandDetailPage /></WithNavbar>} />
      <Route path="/dashboard" component={() => <WithNavbar><DashboardPage /></WithNavbar>} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
