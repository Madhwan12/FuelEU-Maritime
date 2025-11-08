import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ship, TrendingUp, PiggyBank, Users } from "lucide-react";
import RoutesTab from "@/components/dashboard/RoutesTab";
import CompareTab from "@/components/dashboard/CompareTab";
import BankingTab from "@/components/dashboard/BankingTab";
import PoolingTab from "@/components/dashboard/PoolingTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState("routes");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-primary shadow-primary">
              <Ship className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FuelEU Maritime
              </h1>
              <p className="text-sm text-muted-foreground">Compliance Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger
              value="routes"
              className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-md transition-smooth py-3"
            >
              <Ship className="w-4 h-4" />
              <span className="hidden sm:inline">Routes</span>
            </TabsTrigger>
            <TabsTrigger
              value="compare"
              className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-md transition-smooth py-3"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
            </TabsTrigger>
            <TabsTrigger
              value="banking"
              className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-md transition-smooth py-3"
            >
              <PiggyBank className="w-4 h-4" />
              <span className="hidden sm:inline">Banking</span>
            </TabsTrigger>
            <TabsTrigger
              value="pooling"
              className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-md transition-smooth py-3"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Pooling</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="routes" className="space-y-6 animate-fade-in">
            <RoutesTab />
          </TabsContent>

          <TabsContent value="compare" className="space-y-6 animate-fade-in">
            <CompareTab />
          </TabsContent>

          <TabsContent value="banking" className="space-y-6 animate-fade-in">
            <BankingTab />
          </TabsContent>

          <TabsContent value="pooling" className="space-y-6 animate-fade-in">
            <PoolingTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
