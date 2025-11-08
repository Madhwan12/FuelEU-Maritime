import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, CheckCircle2, AlertCircle } from "lucide-react";

interface ComparisonData {
  routeId: string;
  vesselType: string;
  year: number;
  baselineIntensity: number;
  comparisonIntensity: number;
  percentDiff: number;
  compliant: boolean;
}

const TARGET_INTENSITY = 89.3368; // 2% below 91.16

const mockComparisons: ComparisonData[] = [
  { routeId: "R001", vesselType: "Container", year: 2024, baselineIntensity: 91.0, comparisonIntensity: 91.0, percentDiff: 0, compliant: false },
  { routeId: "R002", vesselType: "BulkCarrier", year: 2024, baselineIntensity: 91.0, comparisonIntensity: 88.0, percentDiff: -3.30, compliant: true },
  { routeId: "R003", vesselType: "Tanker", year: 2024, baselineIntensity: 91.0, comparisonIntensity: 93.5, percentDiff: 2.75, compliant: false },
  { routeId: "R004", vesselType: "RoRo", year: 2025, baselineIntensity: 91.0, comparisonIntensity: 89.2, percentDiff: -1.98, compliant: true },
  { routeId: "R005", vesselType: "Container", year: 2025, baselineIntensity: 91.0, comparisonIntensity: 90.5, percentDiff: -0.55, compliant: false },
];

const CompareTab = () => {
  const compliantCount = mockComparisons.filter(c => c.compliant).length;
  const nonCompliantCount = mockComparisons.length - compliantCount;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>Target Intensity</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {TARGET_INTENSITY.toFixed(4)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">gCO₂e/MJ (2% below baseline)</p>
          </CardHeader>
        </Card>
        <Card className="border-success/20">
          <CardHeader className="pb-3">
            <CardDescription>Compliant Routes</CardDescription>
            <CardTitle className="text-3xl font-bold text-success flex items-center gap-2">
              {compliantCount}
              <CheckCircle2 className="w-6 h-6" />
            </CardTitle>
            <p className="text-xs text-muted-foreground">Meeting target intensity</p>
          </CardHeader>
        </Card>
        <Card className="border-warning/20">
          <CardHeader className="pb-3">
            <CardDescription>Non-Compliant Routes</CardDescription>
            <CardTitle className="text-3xl font-bold text-warning flex items-center gap-2">
              {nonCompliantCount}
              <AlertCircle className="w-6 h-6" />
            </CardTitle>
            <p className="text-xs text-muted-foreground">Exceeding target intensity</p>
          </CardHeader>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Route Comparisons</CardTitle>
          <CardDescription>Baseline vs. actual GHG intensity with compliance status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Route ID</th>
                  <th className="text-left p-4 font-semibold text-sm">Vessel Type</th>
                  <th className="text-left p-4 font-semibold text-sm">Year</th>
                  <th className="text-right p-4 font-semibold text-sm">Baseline<br/><span className="text-xs font-normal text-muted-foreground">(gCO₂e/MJ)</span></th>
                  <th className="text-right p-4 font-semibold text-sm">Actual<br/><span className="text-xs font-normal text-muted-foreground">(gCO₂e/MJ)</span></th>
                  <th className="text-right p-4 font-semibold text-sm">Difference</th>
                  <th className="text-center p-4 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockComparisons.map((comparison) => (
                  <tr key={comparison.routeId} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono font-medium">{comparison.routeId}</td>
                    <td className="p-4">{comparison.vesselType}</td>
                    <td className="p-4">{comparison.year}</td>
                    <td className="p-4 text-right font-mono">{comparison.baselineIntensity.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono font-semibold">
                      {comparison.comparisonIntensity.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {comparison.percentDiff < 0 ? (
                          <TrendingDown className="w-4 h-4 text-success" />
                        ) : comparison.percentDiff > 0 ? (
                          <TrendingUp className="w-4 h-4 text-warning" />
                        ) : null}
                        <span
                          className={`font-mono font-semibold ${
                            comparison.percentDiff < 0
                              ? "text-success"
                              : comparison.percentDiff > 0
                              ? "text-warning"
                              : "text-muted-foreground"
                          }`}
                        >
                          {comparison.percentDiff > 0 ? "+" : ""}
                          {comparison.percentDiff.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {comparison.compliant ? (
                        <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Compliant
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Non-Compliant
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Visual Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Intensity Comparison Chart</CardTitle>
          <CardDescription>Visual representation of GHG intensity against target</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockComparisons.map((comparison) => {
              const maxValue = 95;
              const baselineWidth = (comparison.baselineIntensity / maxValue) * 100;
              const comparisonWidth = (comparison.comparisonIntensity / maxValue) * 100;
              const targetWidth = (TARGET_INTENSITY / maxValue) * 100;

              return (
                <div key={comparison.routeId} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{comparison.routeId}</span>
                    <span className="text-xs text-muted-foreground">{comparison.vesselType}</span>
                  </div>
                  <div className="relative h-10 bg-muted/30 rounded-lg overflow-hidden">
                    {/* Target line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
                      style={{ left: `${targetWidth}%` }}
                    >
                      <div className="absolute -top-1 -left-3 w-6 h-6 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                    </div>
                    {/* Comparison bar */}
                    <div
                      className={`absolute top-1 bottom-1 left-1 rounded transition-all ${
                        comparison.compliant ? "bg-success" : "bg-warning"
                      }`}
                      style={{ width: `calc(${comparisonWidth}% - 0.25rem)` }}
                    >
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-white">
                        {comparison.comparisonIntensity.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-muted-foreground">Target ({TARGET_INTENSITY.toFixed(2)})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-muted-foreground">Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning rounded"></div>
              <span className="text-muted-foreground">Non-Compliant</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompareTab;
