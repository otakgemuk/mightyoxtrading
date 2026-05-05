import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { propFirms, products } from "@db/schema";
import { eq } from "drizzle-orm";

export const calculatorRouter = createRouter({
  roi: publicQuery
    .input(
      z.object({
        productId: z.number(),
        expectedMonthlyReturn: z.number().min(0).max(100),
        monthsTrading: z.number().min(1).max(60),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, input.productId));
      
      if (!product) return null;

      const [firm] = await db
        .select()
        .from(propFirms)
        .where(eq(propFirms.id, product.firmId));

      const price = Number(product.price);
      const accountSize = product.accountSize;
      const monthlyReturnRate = input.expectedMonthlyReturn / 100;
      const splitPercentage = firm?.profitSplit 
        ? parseFloat(firm.profitSplit.match(/(\d+)/)?.[0] || "80") / 100 
        : 0.8;

      // Calculate ROI
      const monthlyGross = accountSize * monthlyReturnRate;
      const monthlyNet = monthlyGross * splitPercentage;
      const totalGross = monthlyGross * input.monthsTrading;
      const totalNet = monthlyNet * input.monthsTrading;
      const totalInvestment = price + Number(product.activationFee || 0);
      const roi = totalInvestment > 0 ? ((totalNet - totalInvestment) / totalInvestment) * 100 : 0;
      const monthlyAvg = totalNet / input.monthsTrading;

      return {
        product,
        firmName: firm?.name || "",
        price,
        accountSize,
        activationFee: Number(product.activationFee || 0),
        totalInvestment,
        expectedMonthlyReturn: input.expectedMonthlyReturn,
        monthsTrading: input.monthsTrading,
        splitPercentage: splitPercentage * 100,
        monthlyGross,
        monthlyNet,
        totalGross,
        totalNet,
        roi: Math.round(roi * 100) / 100,
        monthlyAvg: Math.round(monthlyAvg * 100) / 100,
        breakEvenMonths: totalInvestment > 0 && monthlyNet > 0 ? Math.ceil(totalInvestment / monthlyNet) : 0,
      };
    }),

  consistency: publicQuery
    .input(
      z.object({
        firmId: z.number(),
        productId: z.number().optional(),
        dailyProfits: z.array(z.number()),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const [firm] = await db
        .select()
        .from(propFirms)
        .where(eq(propFirms.id, input.firmId));

      let product = null;
      if (input.productId) {
        const [p] = await db
          .select()
          .from(products)
          .where(eq(products.id, input.productId));
        product = p;
      } else {
        const [p] = await db
          .select()
          .from(products)
          .where(eq(products.firmId, input.firmId))
          .limit(1);
        product = p;
      }
      
      if (!product) return null;

      const profits = input.dailyProfits;
      const totalProfit = profits.reduce((sum, p) => sum + p, 0);
      const tradingDays = profits.filter(p => p !== 0).length;
      const profitableDays = profits.filter(p => p > 0).length;
      const bestDay = Math.max(...profits);
      const worstDay = Math.min(...profits);
      
      const accountSize = product.accountSize;
      const profitTarget = accountSize * (Number(product.profitTarget) / 100);
      const bestDayPercent = totalProfit > 0 ? (bestDay / totalProfit) * 100 : 0;
      const worstDayPercent = totalProfit !== 0 ? Math.abs(worstDay / totalProfit) * 100 : 0;
      const minimumDays = product.minimumDays || 0;

      // Analyze consistency
      const warnings: string[] = [];
      
      if (bestDayPercent > 50) {
        warnings.push(`Single day exceeds 50% of total profits (${bestDayPercent.toFixed(1)}%)`);
      }
      if (tradingDays < minimumDays) {
        warnings.push(`Only ${tradingDays} of ${minimumDays} minimum trading days`);
      }
      if (profitableDays < Math.ceil(tradingDays * 0.5)) {
        warnings.push(`Less than 50% of trading days are profitable`);
      }

      const passed = warnings.length === 0 && totalProfit > 0;

      // Parse consistency rule for display
      const consistencyRule = product.consistencyRule || "No specific consistency rule.";

      return {
        firmName: firm?.name || "",
        productName: product.name,
        consistencyRule,
        totalProfit: Math.round(totalProfit * 100) / 100,
        profitTarget: Math.round(profitTarget * 100) / 100,
        tradingDays,
        minimumDays,
        profitableDays,
        bestDay: Math.round(bestDay * 100) / 100,
        worstDay: Math.round(worstDay * 100) / 100,
        bestDayPercent: Math.round(bestDayPercent * 100) / 100,
        worstDayPercent: Math.round(worstDayPercent * 100) / 100,
        passed,
        warnings,
        daysBreakdown: profits.map((profit, i) => ({
          day: i + 1,
          profit: Math.round(profit * 100) / 100,
          percentOfTotal: totalProfit > 0 ? Math.round((profit / totalProfit) * 10000) / 100 : 0,
        })),
      };
    }),
});
