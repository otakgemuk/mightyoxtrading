import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, Target } from "lucide-react";

export function ROICalculator({ productId }: { productId: number }) {
  const [monthlyReturn, setMonthlyReturn] = useState(8);
  const [months, setMonths] = useState(6);

  const { data: roi } = trpc.calculator.roi.useQuery({
    productId,
    expectedMonthlyReturn: monthlyReturn,
    monthsTrading: months,
  });

  if (!roi) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-[#F1F2F6] flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[#00D4AA]" />
        ROI Calculator for {roi.firmName} — {roi.product.name}
      </h4>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-[#8B92A8] flex justify-between">
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
        <div className="space-y-2">
          <label className="text-xs text-[#8B92A8] flex justify-between">
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-[#0A0E1A] border-[#2A3040]">
          <CardContent className="p-3 text-center">
            <DollarSign className="w-4 h-4 text-[#8B92A8] mx-auto mb-1" />
            <div className="text-sm font-bold text-[#00D4AA]">
              ${roi.totalInvestment.toFixed(0)}
            </div>
            <div className="text-[10px] text-[#8B92A8]">Total Investment</div>
          </CardContent>
        </Card>
        <Card className="bg-[#0A0E1A] border-[#2A3040]">
          <CardContent className="p-3 text-center">
            <Target className="w-4 h-4 text-[#8B92A8] mx-auto mb-1" />
            <div className="text-sm font-bold text-[#F1F2F6]">
              ${roi.totalGross.toFixed(0)}
            </div>
            <div className="text-[10px] text-[#8B92A8]">Gross Profit</div>
          </CardContent>
        </Card>
        <Card className="bg-[#0A0E1A] border-[#2A3040]">
          <CardContent className="p-3 text-center">
            <DollarSign className="w-4 h-4 text-[#8B92A8] mx-auto mb-1" />
            <div className="text-sm font-bold text-[#00D4AA]">
              ${roi.totalNet.toFixed(0)}
            </div>
            <div className="text-[10px] text-[#8B92A8]">Net Profit ({roi.splitPercentage}%)</div>
          </CardContent>
        </Card>
        <Card className="bg-[#0A0E1A] border-[#2A3040]">
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-4 h-4 text-[#8B92A8] mx-auto mb-1" />
            <div className="text-sm font-bold text-[#FFB800]">{roi.roi}%</div>
            <div className="text-[10px] text-[#8B92A8]">ROI</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-[#8B92A8] mono">
        <span>Monthly Gross: ${roi.monthlyGross.toFixed(0)}</span>
        <span>Monthly Net: ${roi.monthlyNet.toFixed(0)}</span>
        <span>Break-even: {roi.breakEvenMonths} months</span>
        <span>Monthly Avg: ${roi.monthlyAvg.toFixed(0)}</span>
      </div>
    </div>
  );
}
