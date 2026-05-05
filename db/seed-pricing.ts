// @ts-nocheck
import { getDb } from "../api/queries/connection";
import { propFirms, products } from "./schema";
import fs from "fs";
import path from "path";

interface PricingRow {
  FIRM: string;
  "ACCOUNT TYPE": string;
  "EVAL COST": number;
  "FUNDED SETUP FEE": number;
  "TOTAL": number;
  "MAX # FUNDED": number;
  "DD TYPE": string;
  "TARGET": number;
  "MAX DD": number;
  "MIN DAYS": number;
  "CONSISTENCY_EVAL": string;
  "CONSISTENCY_FUNDED": string;
}

async function seedPricing() {
  const db = getDb();
  console.log("🔄 Loading pricing data from CSV...");

  // Read CSV file
  const csvPath = "/sessions/funny-magical-goldberg/mnt/outputs/Prop_Firms_Pricing_Data.csv";
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n").filter((line) => line.trim());
  const headers = lines[0].split(",");

  const rows: PricingRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const row: any = {};
    headers.forEach((header, index) => {
      const value = values[index]?.trim() || "";
      row[header] = isNaN(Number(value)) ? value : Number(value);
    });
    rows.push(row);
  }

  console.log(`✓ Loaded ${rows.length} pricing records`);

  // Get unique firms
  const uniqueFirms = [...new Set(rows.map((r) => r.FIRM))];
  console.log(`✓ Found ${uniqueFirms.length} unique firms`);

  // Get existing firms or create them
  const firmMap: Map<string, number> = new Map();

  for (const firmName of uniqueFirms) {
    // Try to find existing firm
    const existing = await db
      .select()
      .from(propFirms)
      .where((col: any) => col.name === firmName)
      .limit(1);

    if (existing.length > 0) {
      firmMap.set(firmName, existing[0].id);
      console.log(`  ✓ Found existing firm: ${firmName}`);
    } else {
      // Create new firm
      const slug = firmName.toLowerCase().replace(/\s+/g, "-");
      await db.insert(propFirms).values({
        name: firmName,
        slug: slug,
        tagline: `${firmName} - Proprietary Trading Firm`,
        description: `Proprietary trading firm offering evaluated and funded trading accounts.`,
        websiteUrl: `https://${slug}.com`,
        affiliateUrl: `https://${slug}.com`,
        foundedYear: 2020,
        platforms: ["Rithmic", "NinjaTrader", "TradingView"],
        payoutSchedule: "Variable",
        profitSplit: "Variable",
        trustScore: "4.0",
        bestForTags: ["Futures Traders"],
      });

      const newFirm = await db
        .select()
        .from(propFirms)
        .where((col: any) => col.name === firmName)
        .limit(1);

      if (newFirm.length > 0) {
        firmMap.set(firmName, newFirm[0].id);
        console.log(`  ✓ Created new firm: ${firmName}`);
      }
    }
  }

  // Insert products
  const productInserts = rows.map((row) => {
    const firmId = firmMap.get(row.FIRM);
    if (!firmId) {
      console.warn(`⚠️  Skipping ${row.FIRM} - ${row["ACCOUNT TYPE"]} (firm not found)`);
      return null;
    }

    // Parse account size from ACCOUNT TYPE (e.g., "Intraday 25K" -> 25000)
    const sizeMatch = row["ACCOUNT TYPE"].match(/(\d+)K/);
    const accountSize = sizeMatch ? parseInt(sizeMatch[1]) * 1000 : 50000;

    return {
      firmId: firmId,
      name: row["ACCOUNT TYPE"],
      accountSize: accountSize,
      price: row["EVAL COST"].toString(),
      profitTarget: (row["TARGET"] / accountSize * 100).toFixed(2), // Convert to percentage
      dailyDrawdown: "0.00", // Not directly in CSV
      maxDrawdown: (row["MAX DD"] / accountSize * 100).toFixed(2), // Convert to percentage
      minimumDays: row["MIN DAYS"] || 0,
      consistencyRule: row["CONSISTENCY_EVAL"] || "None specified",
      resetFee: row["FUNDED SETUP FEE"].toString(),
      activationFee: "0.00",
      monthlyFee: "0.00",
    };
  });

  const validInserts = productInserts.filter((p) => p !== null);
  console.log(`\n💾 Inserting ${validInserts.length} products...`);

  // Insert in batches
  const batchSize = 50;
  for (let i = 0; i < validInserts.length; i += batchSize) {
    const batch = validInserts.slice(i, i + batchSize);
    await db.insert(products).values(batch);
    console.log(`  ✓ Inserted batch ${Math.floor(i / batchSize) + 1}`);
  }

  console.log("\n✅ Pricing data seeded successfully!");
}

seedPricing().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
