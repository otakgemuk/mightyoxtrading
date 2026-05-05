// @ts-nocheck
import { getDb } from "../api/queries/connection";
import { propFirms, products, tradingRules, countryRestrictions, educationalContent } from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(tradingRules);
  await db.delete(countryRestrictions);
  await db.delete(products);
  await db.delete(propFirms);
  await db.delete(educationalContent);

  // Seed Prop Firms
  const firmData = [
    {
      name: "Apex Trader Funding",
      slug: "apex-trader-funding",
      tagline: "Trade with up to $300K in buying power",
      description: "Apex Trader Funding offers straightforward evaluation rules with no daily drawdown limits and generous profit splits. Popular among scalpers and high-frequency traders.",
      websiteUrl: "https://apextraderfunding.com",
      affiliateUrl: "https://apextraderfunding.com",
      foundedYear: 2021,
      platforms: ["Rithmic", "Tradovate", "NinjaTrader"] as string[],
      payoutSchedule: "Bi-weekly after first 10 days",
      profitSplit: "100% first $25K, then 90/10",
      trustScore: "4.5",
      bestForTags: ["Scalpers", "High-frequency traders", "Rithmic users"] as string[],
    },
    {
      name: "Topstep",
      slug: "topstep",
      tagline: "The original prop firm — 10+ years in business",
      description: "Topstep is one of the most established futures prop firms with a comprehensive coaching program and strong community. Known for reliability and trader development.",
      websiteUrl: "https://topstep.com",
      affiliateUrl: "https://topstep.com",
      foundedYear: 2012,
      platforms: ["Rithmic", "TradingView", "NinjaTrader"] as string[],
      payoutSchedule: "Weekly after first 5 winning days",
      profitSplit: "90/10",
      trustScore: "4.7",
      bestForTags: ["Beginners", "Traders wanting coaching", "Long-term traders"] as string[],
    },
    {
      name: "Take Profit Trader",
      slug: "take-profit-trader",
      tagline: "80% off resets, instant funding available",
      description: "Take Profit Trader offers competitive pricing with instant funding options and low reset fees. Great for traders who want to get funded quickly without lengthy evaluations.",
      websiteUrl: "https://takeprofittrader.com",
      affiliateUrl: "https://takeprofittrader.com",
      foundedYear: 2022,
      platforms: ["Rithmic"] as string[],
      payoutSchedule: "On-demand after first payout",
      profitSplit: "80/20, up to 90/10 with scaling",
      trustScore: "4.3",
      bestForTags: ["Traders wanting instant funding", "Low reset costs", "Scalpers"] as string[],
    },
    {
      name: "The Trading Pit",
      slug: "the-trading-pit",
      tagline: "Multi-asset: Futures, Forex, Stocks",
      description: "The Trading Pit offers a unique multi-asset prop trading experience. Popular among EU traders and those looking to diversify across multiple markets.",
      websiteUrl: "https://thetradingpit.com",
      affiliateUrl: "https://thetradingpit.com",
      foundedYear: 2021,
      platforms: ["DX Trade", "Match Trader", "cTrader"] as string[],
      payoutSchedule: "Monthly",
      profitSplit: "70/30, up to 80/20",
      trustScore: "4.2",
      bestForTags: ["Multi-asset traders", "EU traders", "Forex traders"] as string[],
    },
    {
      name: "TickTick Trader",
      slug: "ticktick-trader",
      tagline: "Simple rules, fast path to funded",
      description: "TickTick Trader focuses on simplicity with clear, easy-to-understand rules. No consistency requirements and straightforward path to a funded account.",
      websiteUrl: "https://tickticktrader.com",
      affiliateUrl: "https://tickticktrader.com",
      foundedYear: 2022,
      platforms: ["Rithmic", "Tradovate"] as string[],
      payoutSchedule: "Weekly",
      profitSplit: "90/10",
      trustScore: "4.4",
      bestForTags: ["Traders wanting simple rules", "Beginners", "Fast funding"] as string[],
    },
    {
      name: "Earn2Trade",
      slug: "earn2trade",
      tagline: "Education-focused prop firm with gauntlet evaluation",
      description: "Earn2Trade combines trader education with their proprietary Gauntlet evaluation. Ideal for traders who want to learn while earning a funded account.",
      websiteUrl: "https://earn2trade.com",
      affiliateUrl: "https://earn2trade.com",
      foundedYear: 2017,
      platforms: ["Rithmic", "NinjaTrader", "TradingView"] as string[],
      payoutSchedule: "Monthly",
      profitSplit: "80/20",
      trustScore: "4.5",
      bestForTags: ["Education-focused traders", "Career path traders", "Rithmic users"] as string[],
    },
    {
      name: "Leeloo Trading",
      slug: "leeloo-trading",
      tagline: "Multiple account options with transparent pricing",
      description: "Leeloo Trading offers a variety of account sizes and transparent pricing. Known for good customer support and reliable payouts.",
      websiteUrl: "https://leelootrading.com",
      affiliateUrl: "https://leelootrading.com",
      foundedYear: 2019,
      platforms: ["Rithmic", "NinjaTrader"] as string[],
      payoutSchedule: "Bi-weekly",
      profitSplit: "100% up to $12.5K, then 90/10",
      trustScore: "4.4",
      bestForTags: ["Transparent pricing", "Customer support", "Multiple account sizes"] as string[],
    },
    {
      name: "UProfit Trader",
      slug: "uprofit-trader",
      tagline: "No minimum trading days required",
      description: "UProfit Trader stands out with no minimum trading days requirement and a simple one-step evaluation. Pass quickly and trade a funded account.",
      websiteUrl: "https://uprofittrader.com",
      affiliateUrl: "https://uprofittrader.com",
      foundedYear: 2021,
      platforms: ["Rithmic", "Tradovate"] as string[],
      payoutSchedule: "Weekly after first payout",
      profitSplit: "80/20, up to 90/10",
      trustScore: "4.3",
      bestForTags: ["No minimum days", "Fast evaluation", "One-step funding"] as string[],
    },
  ];
  
  // @ts-expect-error - Drizzle JSON insert typing workaround
  await db.insert(propFirms).values(firmData);

  // Seed Products for each firm
  const firmRows = await db.select().from(propFirms);
  
  const apex = firmRows.find(f => f.slug === "apex-trader-funding")!;
  const topstep = firmRows.find(f => f.slug === "topstep")!;
  const takeProfit = firmRows.find(f => f.slug === "take-profit-trader")!;
  const tradingPit = firmRows.find(f => f.slug === "the-trading-pit")!;
  const tickTick = firmRows.find(f => f.slug === "ticktick-trader")!;
  const earn2trade = firmRows.find(f => f.slug === "earn2trade")!;
  const leeloo = firmRows.find(f => f.slug === "leeloo-trading")!;
  const uprofit = firmRows.find(f => f.slug === "uprofit-trader")!;

  await db.insert(products).values([
    // Apex products
    { firmId: apex.id, name: "$25K Evaluation", accountSize: 25000, price: "147.00", profitTarget: "6.00", dailyDrawdown: "0.00", maxDrawdown: "3.00", minimumDays: 0, consistencyRule: "No explicit consistency rule. Maintain sustainable trading patterns.", resetFee: "80.00", activationFee: "0.00" },
    { firmId: apex.id, name: "$50K Evaluation", accountSize: 50000, price: "167.00", profitTarget: "6.00", dailyDrawdown: "0.00", maxDrawdown: "3.00", minimumDays: 0, consistencyRule: "No explicit consistency rule. Maintain sustainable trading patterns.", resetFee: "80.00", activationFee: "0.00" },
    { firmId: apex.id, name: "$100K Evaluation", accountSize: 100000, price: "197.00", profitTarget: "6.00", dailyDrawdown: "0.00", maxDrawdown: "3.00", minimumDays: 0, consistencyRule: "No explicit consistency rule. Maintain sustainable trading patterns.", resetFee: "80.00", activationFee: "0.00" },
    { firmId: apex.id, name: "$150K Evaluation", accountSize: 150000, price: "297.00", profitTarget: "6.00", dailyDrawdown: "0.00", maxDrawdown: "3.00", minimumDays: 0, consistencyRule: "No explicit consistency rule. Maintain sustainable trading patterns.", resetFee: "80.00", activationFee: "0.00" },
    { firmId: apex.id, name: "$300K Evaluation", accountSize: 300000, price: "657.00", profitTarget: "6.00", dailyDrawdown: "0.00", maxDrawdown: "3.00", minimumDays: 0, consistencyRule: "No explicit consistency rule. Maintain sustainable trading patterns.", resetFee: "80.00", activationFee: "0.00" },
    // Topstep products
    { firmId: topstep.id, name: "$50K Trading Combine", accountSize: 50000, price: "165.00", profitTarget: "6.00", dailyDrawdown: "2.00", maxDrawdown: "3.00", minimumDays: 5, consistencyRule: "No single day can exceed 40% of total profits during evaluation. Minimum 5 trading days.", resetFee: "99.00", activationFee: "149.00" },
    { firmId: topstep.id, name: "$100K Trading Combine", accountSize: 100000, price: "325.00", profitTarget: "6.00", dailyDrawdown: "2.00", maxDrawdown: "3.00", minimumDays: 5, consistencyRule: "No single day can exceed 40% of total profits during evaluation. Minimum 5 trading days.", resetFee: "99.00", activationFee: "149.00" },
    { firmId: topstep.id, name: "$150K Trading Combine", accountSize: 150000, price: "375.00", profitTarget: "6.00", dailyDrawdown: "2.00", maxDrawdown: "3.00", minimumDays: 5, consistencyRule: "No single day can exceed 40% of total profits during evaluation. Minimum 5 trading days.", resetFee: "99.00", activationFee: "149.00" },
    // Take Profit products
    { firmId: takeProfit.id, name: "$25K Evaluation", accountSize: 25000, price: "130.00", profitTarget: "6.00", dailyDrawdown: "3.00", maxDrawdown: "6.00", minimumDays: 5, consistencyRule: "Trade at least 5 days. No single trading day can account for more than 50% of total profits.", resetFee: "60.00", activationFee: "0.00" },
    { firmId: takeProfit.id, name: "$50K Evaluation", accountSize: 50000, price: "170.00", profitTarget: "6.00", dailyDrawdown: "3.00", maxDrawdown: "6.00", minimumDays: 5, consistencyRule: "Trade at least 5 days. No single trading day can account for more than 50% of total profits.", resetFee: "60.00", activationFee: "0.00" },
    { firmId: takeProfit.id, name: "$100K Evaluation", accountSize: 100000, price: "300.00", profitTarget: "6.00", dailyDrawdown: "3.00", maxDrawdown: "6.00", minimumDays: 5, consistencyRule: "Trade at least 5 days. No single trading day can account for more than 50% of total profits.", resetFee: "60.00", activationFee: "0.00" },
    { firmId: takeProfit.id, name: "$150K Instant Funding", accountSize: 150000, price: "585.00", profitTarget: "0.00", dailyDrawdown: "3.00", maxDrawdown: "6.00", minimumDays: 0, consistencyRule: "None for instant funding accounts.", resetFee: "100.00", activationFee: "0.00" },
    // Trading Pit products
    { firmId: tradingPit.id, name: "Futures Standard $50K", accountSize: 50000, price: "149.00", profitTarget: "10.00", dailyDrawdown: "5.00", maxDrawdown: "10.00", minimumDays: 0, consistencyRule: "Trade minimum 3 days per phase. No single day exceeding 40% of profits.", resetFee: "99.00", activationFee: "0.00", monthlyFee: "0.00", phase2Required: true },
    { firmId: tradingPit.id, name: "Futures Standard $100K", accountSize: 100000, price: "249.00", profitTarget: "10.00", dailyDrawdown: "5.00", maxDrawdown: "10.00", minimumDays: 0, consistencyRule: "Trade minimum 3 days per phase. No single day exceeding 40% of profits.", resetFee: "99.00", activationFee: "0.00", monthlyFee: "0.00", phase2Required: true },
    // TickTick products
    { firmId: tickTick.id, name: "$25K Evaluation", accountSize: 25000, price: "115.00", profitTarget: "6.00", dailyDrawdown: "0.00", maxDrawdown: "3.50", minimumDays: 0, consistencyRule: "No consistency requirements. Trade freely to reach profit target.", resetFee: "75.00", activationFee: "0.00" },
    { firmId: tickTick.id, name: "$50K Evaluation", accountSize: 50000, price: "145.00", profitTarget: "6.00", dailyDrawdown: "0.00", maxDrawdown: "3.50", minimumDays: 0, consistencyRule: "No consistency requirements. Trade freely to reach profit target.", resetFee: "75.00", activationFee: "0.00" },
    { firmId: tickTick.id, name: "$100K Evaluation", accountSize: 100000, price: "195.00", profitTarget: "6.00", dailyDrawdown: "0.00", maxDrawdown: "3.50", minimumDays: 0, consistencyRule: "No consistency requirements. Trade freely to reach profit target.", resetFee: "75.00", activationFee: "0.00" },
    // Earn2Trade products
    { firmId: earn2trade.id, name: "Gauntlet Mini $50K", accountSize: 50000, price: "170.00", profitTarget: "6.00", dailyDrawdown: "2.00", maxDrawdown: "3.00", minimumDays: 15, consistencyRule: "Trade minimum 15 days. Consistency required — no single day exceeding 30% of total profits.", resetFee: "100.00", activationFee: "0.00" },
    { firmId: earn2trade.id, name: "Gauntlet Mini $100K", accountSize: 100000, price: "320.00", profitTarget: "6.00", dailyDrawdown: "2.00", maxDrawdown: "3.00", minimumDays: 15, consistencyRule: "Trade minimum 15 days. Consistency required — no single day exceeding 30% of total profits.", resetFee: "100.00", activationFee: "0.00" },
    // Leeloo products
    { firmId: leeloo.id, name: "Investor $25K", accountSize: 25000, price: "125.00", profitTarget: "6.00", dailyDrawdown: "2.50", maxDrawdown: "5.00", minimumDays: 0, consistencyRule: "No explicit consistency rule for evaluation.", resetFee: "75.00", activationFee: "0.00", monthlyFee: "0.00" },
    { firmId: leeloo.id, name: "Investor $50K", accountSize: 50000, price: "165.00", profitTarget: "6.00", dailyDrawdown: "2.50", maxDrawdown: "5.00", minimumDays: 0, consistencyRule: "No explicit consistency rule for evaluation.", resetFee: "75.00", activationFee: "0.00", monthlyFee: "0.00" },
    { firmId: leeloo.id, name: "Investor $100K", accountSize: 100000, price: "250.00", profitTarget: "6.00", dailyDrawdown: "2.50", maxDrawdown: "5.00", minimumDays: 0, consistencyRule: "No explicit consistency rule for evaluation.", resetFee: "75.00", activationFee: "0.00", monthlyFee: "0.00" },
    { firmId: leeloo.id, name: "Investor $150K", accountSize: 150000, price: "375.00", profitTarget: "6.00", dailyDrawdown: "2.50", maxDrawdown: "5.00", minimumDays: 0, consistencyRule: "No explicit consistency rule for evaluation.", resetFee: "75.00", activationFee: "0.00", monthlyFee: "0.00" },
    // UProfit products
    { firmId: uprofit.id, name: "$25K Evaluation", accountSize: 25000, price: "135.00", profitTarget: "6.00", dailyDrawdown: "2.50", maxDrawdown: "5.00", minimumDays: 0, consistencyRule: "No minimum trading days required. Pass at your own pace.", resetFee: "85.00", activationFee: "0.00" },
    { firmId: uprofit.id, name: "$50K Evaluation", accountSize: 50000, price: "185.00", profitTarget: "6.00", dailyDrawdown: "2.50", maxDrawdown: "5.00", minimumDays: 0, consistencyRule: "No minimum trading days required. Pass at your own pace.", resetFee: "85.00", activationFee: "0.00" },
    { firmId: uprofit.id, name: "$100K Evaluation", accountSize: 100000, price: "310.00", profitTarget: "6.00", dailyDrawdown: "2.50", maxDrawdown: "5.00", minimumDays: 0, consistencyRule: "No minimum trading days required. Pass at your own pace.", resetFee: "85.00", activationFee: "0.00" },
    { firmId: uprofit.id, name: "$150K Evaluation", accountSize: 150000, price: "420.00", profitTarget: "6.00", dailyDrawdown: "2.50", maxDrawdown: "5.00", minimumDays: 0, consistencyRule: "No minimum trading days required. Pass at your own pace.", resetFee: "85.00", activationFee: "0.00" },
  ]);

  // Seed Trading Rules
  await db.insert(tradingRules).values([
    // Apex rules
    { firmId: apex.id, category: "allowed", rule: "Trade during all permitted hours", detail: "No restrictions on trading hours. Trade whenever markets are open.", severity: "info", orderIndex: 1 },
    { firmId: apex.id, category: "allowed", rule: "Use EAs and automated strategies", detail: "Automated trading is fully permitted on evaluation and live accounts.", severity: "info", orderIndex: 2 },
    { firmId: apex.id, category: "allowed", rule: "Hold positions overnight and over weekends", detail: "Overnight and weekend holds are allowed without restrictions.", severity: "info", orderIndex: 3 },
    { firmId: apex.id, category: "prohibited", rule: "Exceed the maximum trailing drawdown", detail: "Your account balance cannot drop below the maximum drawdown limit.", severity: "critical", orderIndex: 1 },
    { firmId: apex.id, category: "prohibited", rule: "Trade copy from other accounts", detail: "Copy trading or using signals from third parties is prohibited.", severity: "critical", orderIndex: 2 },
    { firmId: apex.id, category: "payout_invalidation", rule: "Inconsistent trading patterns on live account", detail: "Sustainable trading patterns must be maintained on funded accounts.", severity: "warning", orderIndex: 1 },

    // Topstep rules
    { firmId: topstep.id, category: "allowed", rule: "Trade during regular market hours", detail: "Trade futures during normal exchange hours.", severity: "info", orderIndex: 1 },
    { firmId: topstep.id, category: "allowed", rule: "Use personal automated strategies", detail: "Your own EAs and bots are allowed.", severity: "info", orderIndex: 2 },
    { firmId: topstep.id, category: "prohibited", rule: "Exceed daily loss limit", detail: "Daily drawdown is calculated from starting balance each day.", severity: "critical", orderIndex: 1 },
    { firmId: topstep.id, category: "prohibited", rule: "Trade during major news releases", detail: "Trading 2 minutes before and after high-impact news is prohibited.", severity: "warning", orderIndex: 2 },
    { firmId: topstep.id, category: "prohibited", rule: "Hold positions overnight", detail: "All positions must be closed by market close.", severity: "critical", orderIndex: 3 },
    { firmId: topstep.id, category: "payout_invalidation", rule: "Consistency rule violation", detail: "No single day can exceed 40% of total profits during evaluation.", severity: "warning", orderIndex: 1 },
    { firmId: topstep.id, category: "payout_invalidation", rule: "Minimum trading days not met", detail: "Must trade at least 5 days during evaluation.", severity: "warning", orderIndex: 2 },

    // Take Profit rules
    { firmId: takeProfit.id, category: "allowed", rule: "Trade all futures products", detail: "Trade any CME, CBOT, NYMEX, or COMEX futures.", severity: "info", orderIndex: 1 },
    { firmId: takeProfit.id, category: "allowed", rule: "Use automated trading systems", detail: "Bots and EAs are permitted.", severity: "info", orderIndex: 2 },
    { firmId: takeProfit.id, category: "prohibited", rule: "Exceed daily or max drawdown", detail: "Both daily and maximum drawdown limits must be respected.", severity: "critical", orderIndex: 1 },
    { firmId: takeProfit.id, category: "payout_invalidation", rule: "Single day exceeds 50% of profits", detail: "No single trading day can account for more than 50% of total profits.", severity: "warning", orderIndex: 1 },
    { firmId: takeProfit.id, category: "payout_invalidation", rule: "Less than 5 trading days", detail: "Must trade at least 5 days during evaluation.", severity: "warning", orderIndex: 2 },

    // TickTick rules
    { firmId: tickTick.id, category: "allowed", rule: "Trade without consistency requirements", detail: "No consistency rules to worry about.", severity: "info", orderIndex: 1 },
    { firmId: tickTick.id, category: "allowed", rule: "Trade overnight and weekends", detail: "Positions can be held overnight and over weekends.", severity: "info", orderIndex: 2 },
    { firmId: tickTick.id, category: "prohibited", rule: "Exceed maximum drawdown", detail: "Account cannot exceed the maximum drawdown limit.", severity: "critical", orderIndex: 1 },
    { firmId: tickTick.id, category: "prohibited", rule: "Third-party copy trading", detail: "Using copy trading services is not allowed.", severity: "critical", orderIndex: 2 },

    // Trading Pit rules
    { firmId: tradingPit.id, category: "allowed", rule: "Multi-asset trading", detail: "Trade futures, forex, and stocks depending on your account.", severity: "info", orderIndex: 1 },
    { firmId: tradingPit.id, category: "prohibited", rule: "Exceed daily loss limit", detail: "Daily drawdown must not be exceeded.", severity: "critical", orderIndex: 1 },
    { firmId: tradingPit.id, category: "payout_invalidation", rule: "Consistency rule", detail: "No single day exceeding 40% of profits. Minimum 3 days per phase.", severity: "warning", orderIndex: 1 },
  ]);

  // Seed Country Restrictions
  const restrictedCountries = [
    { code: "IR", name: "Iran" },
    { code: "KP", name: "North Korea" },
    { code: "SY", name: "Syria" },
    { code: "CU", name: "Cuba" },
    { code: "MM", name: "Myanmar (Burma)" },
    { code: "AF", name: "Afghanistan" },
    { code: "IQ", name: "Iraq" },
    { code: "YE", name: "Yemen" },
    { code: "VE", name: "Venezuela" },
    { code: "BY", name: "Belarus" },
    { code: "RU", name: "Russia" },
  ];

  for (const firm of firmRows) {
    for (const country of restrictedCountries) {
      await db.insert(countryRestrictions).values({
        firmId: firm.id,
        countryCode: country.code,
        countryName: country.name,
        status: "restricted",
        notes: `${firm.name} does not accept traders from ${country.name} due to regulatory/sanctions requirements.`,
      });
    }
    // Add some firm-specific restrictions
    if (firm.slug === "the-trading-pit") {
      await db.insert(countryRestrictions).values({
        firmId: firm.id,
        countryCode: "US",
        countryName: "United States",
        status: "restricted_live_only",
        notes: "US traders accepted for evaluation but restricted from live funded accounts due to CFTC regulations.",
      });
    }
  }

  // Seed Educational Content
  const eduData = [
    {
      slug: "what-are-futures",
      title: "What Are Futures Contracts?",
      category: "basics",
      content: JSON.stringify({
        sections: [
          {
            heading: "Understanding Futures",
            body: "A futures contract is a legal agreement to buy or sell something at a predetermined price at a specified time in the future. Unlike stocks where you buy a piece of a company, futures are derivative contracts — their value is derived from an underlying asset like the S&P 500 index, crude oil, or gold.",
          },
          {
            heading: "How Futures Trading Works",
            body: "When you trade futures, you are speculating on the price movement of the underlying asset. You don't actually own the asset — you're trading the contract that represents it. This allows for significant leverage, meaning you can control a large position with relatively small capital.",
          },
          {
            heading: "Futures and Prop Firms",
            body: "When you trade futures on a prop firm account, you don't actually take delivery of 500 barrels of oil. You're speculating on price movements, and the prop firm gives you their capital to do it. You keep a portion of the profits, and the firm takes the rest as their fee for providing the capital and infrastructure.",
          },
        ],
      }),
      orderIndex: 1,
    },
    {
      slug: "mini-vs-micro",
      title: "Mini vs Micro Futures Contracts",
      category: "basics",
      content: JSON.stringify({
        sections: [
          {
            heading: "E-mini S&P 500 (ES)",
            body: "The E-mini S&P 500 is the world's most traded futures contract. Each point of movement equals $50 per contract. A 10-point move means $500 P&L. This is powerful but risky for smaller accounts.",
          },
          {
            heading: "Micro E-mini S&P 500 (MES)",
            body: "At 1/10th the size of the E-mini, each point in MES equals $5. The same 10-point move that earns $500 in ES only earns $50 in MES. For prop traders with $25K-$50K accounts, micro contracts allow proper risk management without oversized positions.",
          },
          {
            heading: "Comparison Table",
            body: "Use the comparison tool below to see all contract specifications.",
          },
        ],
        table: [
          { contract: "Micro E-mini S&P (MES)", tickValue: "$1.25/tick", margin: "~$500", bestFor: "Beginners, small accounts" },
          { contract: "E-mini S&P (ES)", tickValue: "$12.50/tick", margin: "~$5,000+", bestFor: "Experienced traders" },
          { contract: "Micro NQ (MNQ)", tickValue: "$0.50/tick", margin: "~$500", bestFor: "Scalpers, risk control" },
          { contract: "E-mini NQ (NQ)", tickValue: "$5.00/tick", margin: "~$5,000+", bestFor: "Higher volume traders" },
        ],
      }),
      orderIndex: 2,
    },
    {
      slug: "prop-firm-evaluations",
      title: "Understanding Prop Firm Evaluations",
      category: "prop_firms",
      content: JSON.stringify({
        sections: [
          {
            heading: "What is an Evaluation?",
            body: "A prop firm evaluation (also called a 'challenge' or 'trading combine') is a test period where you prove your trading skills using a simulated account. You pay a fee to attempt the evaluation, and if you meet the profit target while following all rules, you get a funded account with real capital.",
          },
          {
            heading: "Phase 1: The Evaluation",
            body: "Most firms require you to reach a profit target (typically 6-10%) within a time limit, while staying within drawdown limits. Some firms have a Phase 2 with a lower profit target to verify consistency.",
          },
          {
            heading: "Getting Funded",
            body: "After passing, you sign an agreement and get access to a live funded account. The rules may change slightly on the live account — always read the live account rules carefully.",
          },
        ],
        steps: [
          "Purchase evaluation account",
          "Complete evaluation phase (meet profit target, follow rules)",
          "Pass and get funded (KYC, contract)",
          "Trade live account (follow live rules)",
          "Request payout (schedule, minimum amounts, methods)",
        ],
      }),
      orderIndex: 3,
    },
    {
      slug: "reading-metrics",
      title: "Reading Prop Firm Metrics",
      category: "prop_firms",
      content: JSON.stringify({
        sections: [
          {
            heading: "Profit Target",
            body: "The percentage gain you must achieve to pass the evaluation. Typically 6-10% of the account size. A $50K account with 10% target means you need to make $5,000 in profits.",
          },
          {
            heading: "Daily Drawdown",
            body: "The maximum loss allowed in a single trading day. Calculated from your starting balance that day. A 5% daily DD on $50K means you can lose max $2,500 today.",
          },
          {
            heading: "Maximum Drawdown",
            body: "The total peak-to-trough decline allowed. Some firms use a trailing max DD (follows your highest balance), others use a static DD (from starting balance). Know which type your firm uses!",
          },
          {
            heading: "Profit Split",
            body: "The percentage of profits you keep. 80/20 means you keep 80%, the firm gets 20%. Some firms offer up to 100% on first payouts or with scaling plans.",
          },
        ],
      }),
      orderIndex: 4,
    },
    {
      slug: "risk-management",
      title: "Risk Management for Prop Trading",
      category: "trading",
      content: JSON.stringify({
        sections: [
          {
            heading: "Position Sizing",
            body: "Never risk more than 1-2% of your account on a single trade. On a $50K account, that's $500-$1,000 max risk per trade. Use stop losses on every trade.",
          },
          {
            heading: "Daily Loss Limit Discipline",
            body: "When you hit your daily loss limit, STOP TRADING. Continuing to trade after a losing streak is how most traders fail evaluations. The daily DD exists to protect you from yourself.",
          },
          {
            heading: "When to Stop for the Day",
            body: "Set personal rules: stop after 2 consecutive losses, stop after reaching daily profit goal, never trade when emotional. Discipline separates successful prop traders from failed ones.",
          },
        ],
        calculator: {
          title: "Daily Loss Limit Calculator",
          description: "Enter your account size and daily drawdown % to see your daily limit.",
        },
      }),
      orderIndex: 5,
    },
    {
      slug: "common-mistakes",
      title: "Common Mistakes That Cost Traders",
      category: "trading",
      content: JSON.stringify({
        sections: [
          {
            heading: "Breaking Consistency Rules Unknowingly",
            body: "Many traders don't realize they violated consistency rules until they try to request a payout. Always track your daily profits and ensure no single day exceeds the firm's threshold.",
          },
          {
            heading: "Trading During High-Impact News",
            body: "Some firms prohibit trading 2-5 minutes before and after major economic releases (NFP, FOMC, CPI). Breaking this rule can lead to instant account termination.",
          },
          {
            heading: "Not Understanding Trailing Drawdown",
            body: "A trailing drawdown follows your highest account balance. If you make $3,000 on a $50K account with 5% trailing DD, your new floor is $50,000 + $3,000 - $2,500 = $50,500. If you then lose money, you can't go below $50,500.",
          },
        ],
      }),
      orderIndex: 6,
    },
  ];

  // @ts-expect-error - JSON content field
  await db.insert(educationalContent).values(eduData);

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
