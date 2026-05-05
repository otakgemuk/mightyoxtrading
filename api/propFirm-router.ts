import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { propFirms, products, tradingRules, countryRestrictions } from "@db/schema";
import { eq, like, and } from "drizzle-orm";

export const propFirmRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        accountSize: z.number().optional(),
        priceMax: z.number().optional(),
        countryCode: z.string().optional(),
        platform: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(propFirms);
      
      const conditions = [];
      if (input?.search) {
        conditions.push(like(propFirms.name, `%${input.search}%`));
      }
      
      const results = conditions.length > 0 
        ? await query.where(and(...conditions))
        : await query;
      
      // Get products for each firm to calculate min price
      const firmsWithData = await Promise.all(
        results.map(async (firm) => {
          const firmProducts = await db
            .select()
            .from(products)
            .where(eq(products.firmId, firm.id));
          
          const minPrice = firmProducts.length > 0
            ? Math.min(...firmProducts.map(p => Number(p.price)))
            : 0;
          
          const parsedPlatforms = firm.platforms 
            ? (typeof firm.platforms === 'string' ? JSON.parse(firm.platforms) : firm.platforms) 
            : [];
          const parsedBestFor = firm.bestForTags 
            ? (typeof firm.bestForTags === 'string' ? JSON.parse(firm.bestForTags) : firm.bestForTags) 
            : [];
          
          return {
            ...firm,
            platforms: parsedPlatforms,
            bestForTags: parsedBestFor,
            productCount: firmProducts.length,
            minPrice,
            products: firmProducts,
          };
        })
      );

      // Filter by price and account size if provided
      let filtered = firmsWithData;
      if (input?.priceMax) {
        filtered = filtered.filter(f => f.minPrice <= input.priceMax!);
      }
      if (input?.platform) {
        filtered = filtered.filter(f => f.platforms.includes(input.platform!));
      }

      // If country provided, filter out restricted
      if (input?.countryCode) {
        const restrictedFirmIds = await db
          .select()
          .from(countryRestrictions)
          .where(
            and(
              eq(countryRestrictions.countryCode, input.countryCode.toUpperCase()),
              eq(countryRestrictions.status, "restricted")
            )
          );
        const restrictedIds = new Set(restrictedFirmIds.map(r => r.firmId));
        filtered = filtered.filter(f => !restrictedIds.has(f.id));
      }

      return filtered;
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [firm] = await db
        .select()
        .from(propFirms)
        .where(eq(propFirms.slug, input.slug));
      
      if (!firm) return null;

      const firmProducts = await db
        .select()
        .from(products)
        .where(eq(products.firmId, firm.id));
      
      const rules = await db
        .select()
        .from(tradingRules)
        .where(eq(tradingRules.firmId, firm.id))
        .orderBy(tradingRules.orderIndex);
      
      const restrictions = await db
        .select()
        .from(countryRestrictions)
        .where(eq(countryRestrictions.firmId, firm.id));
      
      const parsedPlatforms = firm.platforms 
        ? (typeof firm.platforms === 'string' ? JSON.parse(firm.platforms) : firm.platforms) 
        : [];
      const parsedBestFor = firm.bestForTags 
        ? (typeof firm.bestForTags === 'string' ? JSON.parse(firm.bestForTags) : firm.bestForTags) 
        : [];

      return {
        ...firm,
        platforms: parsedPlatforms,
        bestForTags: parsedBestFor,
        products: firmProducts,
        rules,
        restrictions,
      };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [firm] = await db
        .select()
        .from(propFirms)
        .where(eq(propFirms.id, input.id));
      
      if (!firm) return null;

      const firmProducts = await db
        .select()
        .from(products)
        .where(eq(products.firmId, firm.id));
      
      const rules = await db
        .select()
        .from(tradingRules)
        .where(eq(tradingRules.firmId, firm.id));

      const parsedPlatforms = firm.platforms 
        ? (typeof firm.platforms === 'string' ? JSON.parse(firm.platforms) : firm.platforms) 
        : [];
      const parsedBestFor = firm.bestForTags 
        ? (typeof firm.bestForTags === 'string' ? JSON.parse(firm.bestForTags) : firm.bestForTags) 
        : [];
      
      return {
        ...firm,
        platforms: parsedPlatforms,
        bestForTags: parsedBestFor,
        products: firmProducts,
        rules,
      };
    }),

  compare: publicQuery
    .input(z.object({ ids: z.array(z.number()) }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await Promise.all(
        input.ids.map(async (id) => {
          const [firm] = await db
            .select()
            .from(propFirms)
            .where(eq(propFirms.id, id));
          
          if (!firm) return null;

          const firmProducts = await db
            .select()
            .from(products)
            .where(eq(products.firmId, firm.id));
          
          const rules = await db
            .select()
            .from(tradingRules)
            .where(eq(tradingRules.firmId, firm.id));
          
          const parsedPlatforms = firm.platforms 
            ? (typeof firm.platforms === 'string' ? JSON.parse(firm.platforms) : firm.platforms) 
            : [];

          return {
            ...firm,
            platforms: parsedPlatforms,
            products: firmProducts,
            rules,
          };
        })
      );
      
      return results.filter(Boolean);
    }),
});
