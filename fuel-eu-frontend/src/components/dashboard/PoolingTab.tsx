import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle2, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface ShipCompliance {
  shipId: string;
  vesselType: string;
  year: number;
  adjustedCB: number;
  selected: boolean;
  cbAfterPool?: number;
}

const mockShips: ShipCompliance[] = [
  { shipId: "SHIP-001", vesselType: "Container", year: 2024, adjustedCB: 12000, selected: false },
  { shipId: "SHIP-002", vesselType: "BulkCarrier", year: 2024, adjustedCB: -8000, selected: false },
  { shipId: "SHIP-003", vesselType: "Tanker", year: 2024, adjustedCB: -5000, selected: false },
  { shipId: "SHIP-004", vesselType: "RoRo", year: 2024, adjustedCB: 15000, selected: false },
  { shipId: "SHIP-005", vesselType: "Container", year: 2024, adjustedCB: -3000, selected: false },
];

const PoolingTab = () => {
  const [ships, setShips] = useState<ShipCompliance[]>(mockShips);

  const toggleShipSelection = (shipId: string) => {
    setShips(ships.map(s => s.shipId === shipId ? { ...s, selected: !s.selected } : s));
  };

  const selectedShips = ships.filter(s => s.selected);
  const poolSum = selectedShips.reduce((sum, ship) => sum + ship.adjustedCB, 0);
  const isPoolValid = poolSum >= 0;

  const deficitShips = selectedShips.filter(s => s.adjustedCB < 0);
  const surplusShips = selectedShips.filter(s => s.adjustedCB > 0);

  const handleCreatePool = () => {
    if (selectedShips.length < 2) {
      toast.error("Invalid pool", { description: "Select at least 2 ships to create a pool" });
      return;
    }

    if (!isPoolValid) {
      toast.error("Invalid pool", { description: "Pool sum must be non-negative" });
      return;
    }

    // Greedy allocation algorithm
    const sortedShips = [...selectedShips].sort((a, b) => b.adjustedCB - a.adjustedCB);
    const allocation = sortedShips.map(ship => ({ ...ship, cbAfterPool: ship.adjustedCB }));

    // Transfer surplus to deficits
    for (let i = 0; i < allocation.length; i++) {
      if (allocation[i].cbAfterPool! <= 0) continue;

      for (let j = allocation.length - 1; j > i; j--) {
        if (allocation[j].cbAfterPool! >= 0) continue;

        const transfer = Math.min(allocation[i].cbAfterPool!, -allocation[j].cbAfterPool!);
        allocation[i].cbAfterPool! -= transfer;
        allocation[j].cbAfterPool! += transfer;

        if (allocation[i].cbAfterPool! <= 0) break;
      }
    }

    // Validate constraints
    const allValid = allocation.every(ship => {
      const original = selectedShips.find(s => s.shipId === ship.shipId);
      if (!original) return false;

      if (original.adjustedCB < 0 && ship.cbAfterPool! < original.adjustedCB) {
        return false; // Deficit ship got worse
      }
      if (original.adjustedCB > 0 && ship.cbAfterPool! < 0) {
        return false; // Surplus ship went negative
      }
      return true;
    });

    if (!allValid) {
      toast.error("Pool validation failed", { 
        description: "Pool allocations violate compliance constraints" 
      });
      return;
    }

    setShips(ships.map(s => {
      const pooledShip = allocation.find(a => a.shipId === s.shipId);
      return pooledShip ? { ...s, cbAfterPool: pooledShip.cbAfterPool } : s;
    }));

    toast.success("Pool created successfully", {
      description: `${selectedShips.length} ships pooled with total CB of ${poolSum.toLocaleString()} gCO₂e`
    });
  };

  return (
    <div className="space-y-6">
      {/* Pool Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>Selected Ships</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {selectedShips.length}
            </CardTitle>
            <p className="text-xs text-muted-foreground">ships in pool</p>
          </CardHeader>
        </Card>

        <Card className={poolSum >= 0 ? "border-success/20" : "border-warning/20"}>
          <CardHeader className="pb-3">
            <CardDescription>Pool Sum</CardDescription>
            <CardTitle className={`text-3xl font-bold ${poolSum >= 0 ? "text-success" : "text-warning"}`}>
              {poolSum >= 0 ? "+" : ""}{poolSum.toLocaleString()}
            </CardTitle>
            <p className="text-xs text-muted-foreground">gCO₂e total</p>
          </CardHeader>
        </Card>

        <Card className="border-success/20">
          <CardHeader className="pb-3">
            <CardDescription>Surplus Ships</CardDescription>
            <CardTitle className="text-3xl font-bold text-success flex items-center gap-2">
              {surplusShips.length}
              <TrendingUp className="w-5 h-5" />
            </CardTitle>
            <p className="text-xs text-muted-foreground">positive balance</p>
          </CardHeader>
        </Card>

        <Card className="border-warning/20">
          <CardHeader className="pb-3">
            <CardDescription>Deficit Ships</CardDescription>
            <CardTitle className="text-3xl font-bold text-warning flex items-center gap-2">
              {deficitShips.length}
              <TrendingDown className="w-5 h-5" />
            </CardTitle>
            <p className="text-xs text-muted-foreground">negative balance</p>
          </CardHeader>
        </Card>
      </div>

      {/* Pooling Info */}
      <Card className="border-secondary/10 bg-secondary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" />
            Article 21 — Pooling
          </CardTitle>
          <CardDescription>
            Ships can pool their compliance balances together. The pool is valid if the sum of all balances is non-negative. Deficit ships cannot exit worse, and surplus ships cannot exit negative.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Create Pool Action */}
      <Card>
        <CardHeader>
          <CardTitle>Create Pool</CardTitle>
          <CardDescription>Select ships to pool their compliance balances</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              {isPoolValid ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-warning" />
              )}
              <div>
                <p className="font-medium">
                  {isPoolValid ? "Pool is Valid" : "Pool is Invalid"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isPoolValid
                    ? "Sum of selected balances is non-negative"
                    : "Sum must be ≥ 0 to create pool"}
                </p>
              </div>
            </div>
            <Badge variant={isPoolValid ? "default" : "outline"} className={isPoolValid ? "bg-success hover:bg-success/90" : "bg-warning/10 text-warning border-warning/20"}>
              {poolSum >= 0 ? "+" : ""}{poolSum.toLocaleString()} gCO₂e
            </Badge>
          </div>
          <Button
            onClick={handleCreatePool}
            disabled={selectedShips.length < 2 || !isPoolValid}
            className="w-full"
            size="lg"
          >
            <Users className="w-4 h-4 mr-2" />
            Create Pool ({selectedShips.length} ships)
          </Button>
        </CardContent>
      </Card>

      {/* Ships List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Ships</CardTitle>
          <CardDescription>Select ships to include in the pooling arrangement</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="w-12 p-4"></th>
                  <th className="text-left p-4 font-semibold text-sm">Ship ID</th>
                  <th className="text-left p-4 font-semibold text-sm">Vessel Type</th>
                  <th className="text-left p-4 font-semibold text-sm">Year</th>
                  <th className="text-right p-4 font-semibold text-sm">CB Before<br/><span className="text-xs font-normal text-muted-foreground">(gCO₂e)</span></th>
                  <th className="text-right p-4 font-semibold text-sm">CB After Pool<br/><span className="text-xs font-normal text-muted-foreground">(gCO₂e)</span></th>
                  <th className="text-center p-4 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {ships.map((ship) => (
                  <tr
                    key={ship.shipId}
                    className={`border-b border-border hover:bg-muted/30 transition-colors ${
                      ship.selected ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={ship.selected}
                        onCheckedChange={() => toggleShipSelection(ship.shipId)}
                      />
                    </td>
                    <td className="p-4 font-mono font-medium">{ship.shipId}</td>
                    <td className="p-4">{ship.vesselType}</td>
                    <td className="p-4">{ship.year}</td>
                    <td className="p-4 text-right">
                      <span
                        className={`font-mono font-semibold ${
                          ship.adjustedCB >= 0 ? "text-success" : "text-warning"
                        }`}
                      >
                        {ship.adjustedCB >= 0 ? "+" : ""}
                        {ship.adjustedCB.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {ship.cbAfterPool !== undefined ? (
                        <span
                          className={`font-mono font-semibold ${
                            ship.cbAfterPool >= 0 ? "text-success" : "text-warning"
                          }`}
                        >
                          {ship.cbAfterPool >= 0 ? "+" : ""}
                          {ship.cbAfterPool.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {ship.adjustedCB >= 0 ? (
                        <Badge className="bg-success/10 text-success border-success/20">
                          Surplus
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                          Deficit
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
    </div>
  );
};

export default PoolingTab;
