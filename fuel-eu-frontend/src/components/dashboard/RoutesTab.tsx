import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ship, Filter, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Route {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline?: boolean;
}

const mockRoutes: Route[] = [
  { routeId: "R001", vesselType: "Container", fuelType: "HFO", year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500 },
  { routeId: "R002", vesselType: "BulkCarrier", fuelType: "LNG", year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200 },
  { routeId: "R003", vesselType: "Tanker", fuelType: "MGO", year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700 },
  { routeId: "R004", vesselType: "RoRo", fuelType: "HFO", year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300 },
  { routeId: "R005", vesselType: "Container", fuelType: "LNG", year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400 },
];

const RoutesTab = () => {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [vesselTypeFilter, setVesselTypeFilter] = useState<string>("all");
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");

  const filteredRoutes = routes.filter((route) => {
    if (vesselTypeFilter !== "all" && route.vesselType !== vesselTypeFilter) return false;
    if (fuelTypeFilter !== "all" && route.fuelType !== fuelTypeFilter) return false;
    if (yearFilter !== "all" && route.year.toString() !== yearFilter) return false;
    return true;
  });

  const handleSetBaseline = (routeId: string) => {
    setRoutes(routes.map(r => ({ ...r, isBaseline: r.routeId === routeId })));
    toast.success("Baseline route updated", {
      description: `Route ${routeId} has been set as the baseline.`
    });
  };

  const vesselTypes = ["all", ...Array.from(new Set(routes.map(r => r.vesselType)))];
  const fuelTypes = ["all", ...Array.from(new Set(routes.map(r => r.fuelType)))];
  const years = ["all", ...Array.from(new Set(routes.map(r => r.year.toString())))];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-primary/20 shadow-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-primary" />
            <CardTitle>Route Management</CardTitle>
          </div>
          <CardDescription>View and manage maritime routes and their emissions data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={vesselTypeFilter} onValueChange={setVesselTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Vessel Type" />
              </SelectTrigger>
              <SelectContent>
                {vesselTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Vessels" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Fuels" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>
                    {year === "all" ? "All Years" : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Routes Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Route ID</th>
                  <th className="text-left p-4 font-semibold text-sm">Vessel Type</th>
                  <th className="text-left p-4 font-semibold text-sm">Fuel Type</th>
                  <th className="text-left p-4 font-semibold text-sm">Year</th>
                  <th className="text-right p-4 font-semibold text-sm">GHG Intensity<br/><span className="text-xs font-normal text-muted-foreground">(gCO₂e/MJ)</span></th>
                  <th className="text-right p-4 font-semibold text-sm">Fuel Consumption<br/><span className="text-xs font-normal text-muted-foreground">(t)</span></th>
                  <th className="text-right p-4 font-semibold text-sm">Distance<br/><span className="text-xs font-normal text-muted-foreground">(km)</span></th>
                  <th className="text-right p-4 font-semibold text-sm">Total Emissions<br/><span className="text-xs font-normal text-muted-foreground">(t)</span></th>
                  <th className="text-center p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route) => (
                  <tr key={route.routeId} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{route.routeId}</span>
                        {route.isBaseline && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Baseline
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{route.vesselType}</td>
                    <td className="p-4">
                      <Badge variant="secondary" className="font-mono">
                        {route.fuelType}
                      </Badge>
                    </td>
                    <td className="p-4">{route.year}</td>
                    <td className="p-4 text-right font-mono">{route.ghgIntensity.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono">{route.fuelConsumption.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono">{route.distance.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono">{route.totalEmissions.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <Button
                        size="sm"
                        variant={route.isBaseline ? "outline" : "default"}
                        onClick={() => handleSetBaseline(route.routeId)}
                        disabled={route.isBaseline}
                        className="transition-smooth"
                      >
                        {route.isBaseline ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Set
                          </>
                        ) : (
                          "Set Baseline"
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRoutes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Ship className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No routes match the selected filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoutesTab;
