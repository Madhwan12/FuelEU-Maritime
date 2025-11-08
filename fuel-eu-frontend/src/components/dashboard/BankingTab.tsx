import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, TrendingUp, TrendingDown, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

interface BankingState {
  year: number;
  cbBefore: number;
  banked: number;
  cbAfter: number;
}

const BankingTab = () => {
  const [bankingState, setBankingState] = useState<BankingState>({
    year: 2024,
    cbBefore: 15000,
    banked: 0,
    cbAfter: 15000,
  });
  const [bankAmount, setBankAmount] = useState<string>("");
  const [applyAmount, setApplyAmount] = useState<string>("");

  const handleBank = () => {
    const amount = parseFloat(bankAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid amount", { description: "Please enter a valid positive number" });
      return;
    }
    if (amount > bankingState.cbBefore) {
      toast.error("Insufficient balance", { description: "Cannot bank more than available CB" });
      return;
    }

    setBankingState({
      ...bankingState,
      banked: bankingState.banked + amount,
      cbBefore: bankingState.cbBefore - amount,
      cbAfter: bankingState.cbBefore - amount,
    });
    setBankAmount("");
    toast.success("Balance banked successfully", {
      description: `${amount.toLocaleString()} gCO₂e has been added to your banking reserve`
    });
  };

  const handleApply = () => {
    const amount = parseFloat(applyAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid amount", { description: "Please enter a valid positive number" });
      return;
    }
    if (amount > bankingState.banked) {
      toast.error("Insufficient banked balance", { description: "Cannot apply more than banked amount" });
      return;
    }

    setBankingState({
      ...bankingState,
      banked: bankingState.banked - amount,
      cbBefore: bankingState.cbBefore + amount,
      cbAfter: bankingState.cbBefore + amount,
    });
    setApplyAmount("");
    toast.success("Banked balance applied", {
      description: `${amount.toLocaleString()} gCO₂e has been applied to current deficit`
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Current Balance</CardDescription>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">
              {bankingState.cbBefore.toLocaleString()}
            </CardTitle>
            <p className="text-xs text-muted-foreground">gCO₂e available</p>
          </CardHeader>
        </Card>

        <Card className="border-secondary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Banked Surplus</CardDescription>
              <PiggyBank className="w-4 h-4 text-secondary" />
            </div>
            <CardTitle className="text-3xl font-bold text-secondary">
              {bankingState.banked.toLocaleString()}
            </CardTitle>
            <p className="text-xs text-muted-foreground">gCO₂e in reserve</p>
          </CardHeader>
        </Card>

        <Card className="border-accent/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Balance After</CardDescription>
              <ArrowRightLeft className="w-4 h-4 text-accent-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold">
              {bankingState.cbAfter.toLocaleString()}
            </CardTitle>
            <p className="text-xs text-muted-foreground">gCO₂e projected</p>
          </CardHeader>
        </Card>
      </div>

      {/* Banking Info */}
      <Card className="border-primary/10 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-primary" />
            Article 20 — Banking
          </CardTitle>
          <CardDescription>
            Companies with positive compliance balance can bank their surplus for future use. Banked surplus can be applied to offset future deficits, providing flexibility in compliance management.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Surplus */}
        <Card>
          <CardHeader>
            <CardTitle>Bank Surplus</CardTitle>
            <CardDescription>Move positive compliance balance to banking reserve</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank-amount">Amount (gCO₂e)</Label>
              <Input
                id="bank-amount"
                type="number"
                placeholder="Enter amount to bank"
                value={bankAmount}
                onChange={(e) => setBankAmount(e.target.value)}
                disabled={bankingState.cbBefore <= 0}
              />
              <p className="text-xs text-muted-foreground">
                Available to bank: <span className="font-semibold">{bankingState.cbBefore.toLocaleString()} gCO₂e</span>
              </p>
            </div>
            <Button
              onClick={handleBank}
              disabled={bankingState.cbBefore <= 0}
              className="w-full"
            >
              <PiggyBank className="w-4 h-4 mr-2" />
              Bank Surplus
            </Button>
            {bankingState.cbBefore <= 0 && (
              <Badge variant="outline" className="w-full justify-center py-2 bg-warning/10 text-warning border-warning/20">
                No positive balance available to bank
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Apply Banked */}
        <Card>
          <CardHeader>
            <CardTitle>Apply Banked Balance</CardTitle>
            <CardDescription>Use banked surplus to offset current deficit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apply-amount">Amount (gCO₂e)</Label>
              <Input
                id="apply-amount"
                type="number"
                placeholder="Enter amount to apply"
                value={applyAmount}
                onChange={(e) => setApplyAmount(e.target.value)}
                disabled={bankingState.banked <= 0}
              />
              <p className="text-xs text-muted-foreground">
                Banked balance: <span className="font-semibold">{bankingState.banked.toLocaleString()} gCO₂e</span>
              </p>
            </div>
            <Button
              onClick={handleApply}
              disabled={bankingState.banked <= 0}
              className="w-full"
              variant="secondary"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Apply to Deficit
            </Button>
            {bankingState.banked <= 0 && (
              <Badge variant="outline" className="w-full justify-center py-2 bg-muted">
                No banked balance available to apply
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Banking History</CardTitle>
          <CardDescription>Recent banking transactions for year {bankingState.year}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Initial Balance</p>
                  <p className="text-xs text-muted-foreground">Opening compliance balance</p>
                </div>
              </div>
              <span className="font-mono font-semibold text-success">+15,000 gCO₂e</span>
            </div>
            <div className="text-center py-6 text-muted-foreground text-sm">
              No transactions yet. Bank surplus or apply banked balance to see history.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankingTab;
