import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/providers/trpc";
import { Slider } from "@/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

function ROICalculatorStandalone() {
  const { data: firms } = trpc.propFirm.list.useQuery({});
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [monthlyReturn, setMonthlyReturn] = useState(8);
  const [months, setMonths] = useState(6);

  const allProducts = firms?.flatMap((f) =>
    f.products?.map((p) => ({ ...p, firmName: f.name }))
  ) || [];

  const { data: roi } = trpc.calculator.roi.useQuery(
    {
      productId: selectedProduct!,
      expectedMonthlyReturn: monthlyReturn,
      monthsTrading: months,
    },
    { enabled: !!selectedProduct }
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="space-y-4">
        <label className="text-sm font-medium text-[#F1F2F6]">
          Select Account
        </label>
        <Select
          onValueChange={(v) => setSelectedProduct(Number(v))}
        >
          <SelectTrigger className="bg-[#0A0E1A] border-[#2A3040] text-[#F1F2F6]">
            <SelectValue placeholder="Choose a prop firm account..." />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1F2E] border-[#2A3040]">
            {allProducts.map((p) => (
              <SelectItem
                key={p.id}
                value={String(p.id)}
                className="text-[#F1F2F6] focus:bg-[#00D4AA]/10 focus:text-[#00D4AA]"
              >
                {p.firmName} — {p.name} (${p.price})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm text-[#8B92A8] flex justify-between">
            <span>Expected Monthly Return</span>
            <span className="text-[#00D4AA] font-semibold">{monthlyReturn}%</span>
          </label>
          <Slider
            value={[monthlyReturn]}
            onValueChange={(v) => setMonthlyReturn(v[0])}
            max={50}
            min={1}
            step={1}
          />
        </div>
        <div className="space-y-3">
          <label className="text-sm text-[#8B92A8] flex justify-between">
            <span>Months Trading</span>
            <span className="text-[#00D4AA] font-semibold">{months}</span>
          </label>
          <Slider
            value={[months]}
            onValueChange={(v) => setMonths(v[0])}
            max={24}
            min={1}
            step={1}
          />
        </div>
      </div>

      {roi && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <Card className="bg-[#0A0E1A] border-[#2A3040]">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-5 h-5 text-[#8B92A8] mx-auto mb-2" />
              <div className="text-xl font-bold text-[#00D4AA]">
                ${roi.totalInvestment.toFixed(0)}
              </div>
              <div className="text-xs text-[#8B92A8]">Total Investment</div>
            </CardContent>
          </Card>
          <Card className="bg-[#0A0E1A] border-[#2A3040]">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-5 h-5 text-[#8B92A8] mx-auto mb-2" />
              <div className="text-xl font-bold text-[#F1F2F6]">
                ${roi.totalGross.toFixed(0)}
              </div>
              <div className="text-xs text-[#8B92A8]">Gross Profit</div>
            </CardContent>
          </Card>
          <Card className="bg-[#0A0E1A] border-[#2A3040]">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-5 h-5 text-[#8B92A8] mx-auto mb-2" />
              <div className="text-xl font-bold text-[#00D4AA]">
                ${roi.totalNet.toFixed(0)}
              </div>
              <div className="text-xs text-[#8B92A8]">
                Net ({roi.splitPercentage}%)
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0A0E1A] border-[#2A3040]">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-5 h-5 text-[#8B92A8] mx-auto mb-2" />
              <div className="text-xl font-bold text-[#FFB800]">{roi.roi}%</div>
              <div className="text-xs text-[#8B92A8]">ROI</div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {roi && (
        <div className="text-center text-sm text-[#8B92A8]">
          Break-even in <span className="text-[#00D4AA] font-semibold">{roi.breakEvenMonths} months</span> 
          {" "}· Monthly average: <span className="text-[#00D4AA] font-semibold">${roi.monthlyAvg.toFixed(0)}</span>
        </div>
      )}
    </div>
  );
}

function ConsistencyCalculator() {
  const { data: firms } = trpc.propFirm.list.useQuery({});
  const [selectedFirm, setSelectedFirm] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [numDays, setNumDays] = useState(10);
  const [dailyProfits, setDailyProfits] = useState<number[]>(Array(10).fill(0));
  const [submitted, setSubmitted] = useState(false);

  const selectedFirmData = firms?.find((f) => f.id === selectedFirm);
  const firmProducts = selectedFirmData?.products || [];

  const { data: result } = trpc.calculator.consistency.useQuery(
    {
      firmId: selectedFirm!,
      productId: selectedProduct || undefined,
      dailyProfits: dailyProfits.slice(0, numDays),
    },
    { enabled: submitted && !!selectedFirm }
  );

  const updateProfit = (index: number, value: string) => {
    const newProfits = [...dailyProfits];
    newProfits[index] = parseFloat(value) || 0;
    setDailyProfits(newProfits);
    setSubmitted(false);
  };

  const simulatePattern = (type: "consistent" | "bigwin" | "mixed") => {
    const target = 3000;
    const newProfits = Array(numDays).fill(0);
    
    switch (type) {
      case "consistent":
        for (let i = 0; i < numDays; i++) {
          newProfits[i] = +(target / numDays + (Math.random() - 0.5) * 100).toFixed(2);
        }
        break;
      case "bigwin":
        newProfits[0] = target * 0.6;
        for (let i = 1; i < numDays; i++) {
          newProfits[i] = +(target * 0.4 / (numDays - 1)).toFixed(2);
        }
        break;
      case "mixed":
        for (let i = 0; i < numDays; i++) {
          newProfits[i] = Math.random() > 0.3 
            ? +(Math.random() * target / numDays * 2).toFixed(2)
            : -(Math.random() * 200).toFixed(2);
        }
        break;
    }
    setDailyProfits(newProfits);
    setSubmitted(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#F1F2F6]">Select Firm</label>
          <Select onValueChange={(v) => { setSelectedFirm(Number(v)); setSelectedProduct(null); setSubmitted(false); }}>
            <SelectTrigger className="bg-[#0A0E1A] border-[#2A3040] text-[#F1F2F6]">
              <SelectValue placeholder="Choose prop firm..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1F2E] border-[#2A3040]">
              {firms?.map((f) => (
                <SelectItem key={f.id} value={String(f.id)} className="text-[#F1F2F6]">
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#F1F2F6]">Select Account</label>
          <Select onValueChange={(v) => { setSelectedProduct(Number(v)); setSubmitted(false); }} disabled={!selectedFirm}>
            <SelectTrigger className="bg-[#0A0E1A] border-[#2A3040] text-[#F1F2F6]">
              <SelectValue placeholder="Choose account..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1F2E] border-[#2A3040]">
              {firmProducts.map((p) => (
                <SelectItem key={p.id} value={String(p.id)} className="text-[#F1F2F6]">
                  {p.name} (${p.price})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedProduct && (
        <div className="bg-[#00D4AA]/5 border border-[#00D4AA]/20 rounded-lg p-4 text-sm text-[#8B92A8]">
          {firmProducts.find(p => p.id === selectedProduct)?.consistencyRule || "No consistency rule specified."}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm text-[#8B92A8] flex justify-between">
          <span>Number of Trading Days</span>
          <span className="text-[#00D4AA] font-semibold">{numDays}</span>
        </label>
        <Slider
          value={[numDays]}
          onValueChange={(v) => {
            setNumDays(v[0]);
            setDailyProfits((prev) => {
              const next = [...prev];
              while (next.length < v[0]) next.push(0);
              return next.slice(0, v[0]);
            });
            setSubmitted(false);
          }}
          max={30}
          min={1}
          step={1}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-[#8B92A8] mr-2">Simulate:</span>
        {(["consistent", "bigwin", "mixed"] as const).map((type) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            onClick={() => simulatePattern(type)}
            className="border-[#2A3040] text-[#8B92A8] hover:text-[#F1F2F6] text-xs capitalize"
          >
            {type === "bigwin" ? "One Big Win" : type}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {Array.from({ length: numDays }).map((_, i) => (
          <div key={i} className="space-y-1">
            <label className="text-[10px] text-[#8B92A8]">Day {i + 1}</label>
            <Input
              type="number"
              value={dailyProfits[i] || ""}
              onChange={(e) => updateProfit(i, e.target.value)}
              placeholder="0"
              className="bg-[#0A0E1A] border-[#2A3040] text-[#F1F2F6] text-sm h-9"
            />
          </div>
        ))}
      </div>

      <Button
        onClick={() => setSubmitted(true)}
        className="w-full bg-[#00D4AA] hover:bg-[#00B894] text-[#0A0E1A] font-semibold"
        disabled={!selectedFirm}
      >
        <Calculator className="w-4 h-4 mr-2" />
        Calculate Consistency
      </Button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Pass/Fail */}
          <Card
            className={`border ${
              result.passed
                ? "bg-[#00D4AA]/5 border-[#00D4AA]/30"
                : "bg-[#FF4757]/5 border-[#FF4757]/30"
            }`}
          >
            <CardContent className="p-6 text-center">
              {result.passed ? (
                <>
                  <CheckCircle2 className="w-12 h-12 text-[#00D4AA] mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-[#00D4AA]">CONSISTENCY PASSED</h3>
                </>
              ) : (
                <>
                  <XCircle className="w-12 h-12 text-[#FF4757] mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-[#FF4757]">CONSISTENCY FAILED</h3>
                </>
              )}
            </CardContent>
          </Card>

          {/* Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="bg-[#0A0E1A] border-[#2A3040]">
              <CardContent className="p-3 text-center">
                <div className="text-sm font-bold text-[#F1F2F6]">${result.totalProfit}</div>
                <div className="text-[10px] text-[#8B92A8]">Total Profit</div>
              </CardContent>
            </Card>
            <Card className="bg-[#0A0E1A] border-[#2A3040]">
              <CardContent className="p-3 text-center">
                <div className="text-sm font-bold text-[#F1F2F6]">${result.bestDay}</div>
                <div className="text-[10px] text-[#8B92A8]">Best Day ({result.bestDayPercent}%)</div>
              </CardContent>
            </Card>
            <Card className="bg-[#0A0E1A] border-[#2A3040]">
              <CardContent className="p-3 text-center">
                <div className="text-sm font-bold text-[#F1F2F6]">
                  {result.tradingDays}/{result.minimumDays}
                </div>
                <div className="text-[10px] text-[#8B92A8]">Days (min)</div>
              </CardContent>
            </Card>
            <Card className="bg-[#0A0E1A] border-[#2A3040]">
              <CardContent className="p-3 text-center">
                <div className="text-sm font-bold text-[#F1F2F6]">${result.profitTarget}</div>
                <div className="text-[10px] text-[#8B92A8]">Target</div>
              </CardContent>
            </Card>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="space-y-2">
              {result.warnings.map((w, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-[#FFB800] bg-[#FFB800]/5 border border-[#FFB800]/20 rounded-lg p-3"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {w}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function Calculators() {
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="bg-[#1A1F2E] border-b border-[#2A3040]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-[#F1F2F6] mb-2">
              Trader Calculators
            </h1>
            <p className="text-[#8B92A8]">
              ROI and consistency tools to evaluate prop firms before you buy
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="roi" className="space-y-8">
          <TabsList className="bg-[#1A1F2E] border border-[#2A3040] w-full justify-start">
            <TabsTrigger
              value="roi"
              className="data-[state=active]:bg-[#00D4AA] data-[state=active]:text-[#0A0E1A]"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              ROI Calculator
            </TabsTrigger>
            <TabsTrigger
              value="consistency"
              className="data-[state=active]:bg-[#00D4AA] data-[state=active]:text-[#0A0E1A]"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Consistency Calculator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roi">
            <ROICalculatorStandalone />
          </TabsContent>

          <TabsContent value="consistency">
            <ConsistencyCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
