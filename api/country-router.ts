import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { propFirms, countryRestrictions, products } from "@db/schema";
import { eq } from "drizzle-orm";

export const countryRouter = createRouter({
  check: publicQuery
    .input(z.object({ countryCode: z.string().length(2) }))
    .query(async ({ input }) => {
      const db = getDb();
      const code = input.countryCode.toUpperCase();
      
      // Get all firms
      const allFirms = await db.select().from(propFirms);
      
      // Get restrictions for this country
      const restrictions = await db
        .select()
        .from(countryRestrictions)
        .where(eq(countryRestrictions.countryCode, code));
      
      const restrictedFirmIds = new Set(
        restrictions.filter(r => r.status === "restricted").map(r => r.firmId)
      );
      const restrictedLiveIds = new Set(
        restrictions.filter(r => r.status === "restricted_live_only").map(r => r.firmId)
      );
      
      // Get a sample product for each firm
      const accepting = [];
      const restricted = [];
      
      for (const firm of allFirms) {
        const [sampleProduct] = await db
          .select()
          .from(products)
          .where(eq(products.firmId, firm.id))
          .limit(1);
        
        const parsedPlatforms = firm.platforms 
          ? (typeof firm.platforms === 'string' ? JSON.parse(firm.platforms) : firm.platforms) 
          : [];
        
        const firmData = {
          ...firm,
          platforms: parsedPlatforms,
          sampleProduct: sampleProduct || null,
        };
        
        if (restrictedFirmIds.has(firm.id)) {
          const restriction = restrictions.find(r => r.firmId === firm.id);
          restricted.push({
            ...firmData,
            restrictionReason: restriction?.notes || "Not accepted from this country.",
            status: "restricted" as const,
          });
        } else if (restrictedLiveIds.has(firm.id)) {
          accepting.push({
            ...firmData,
            status: "restricted_live_only" as const,
            note: "Accepted for evaluation but not for live funded accounts.",
          });
        } else {
          accepting.push({
            ...firmData,
            status: "allowed" as const,
          });
        }
      }
      
      return {
        countryCode: code,
        accepting,
        restricted,
      };
    }),

  listFirms: publicQuery
    .input(z.object({ firmId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const restrictions = await db
        .select()
        .from(countryRestrictions)
        .where(eq(countryRestrictions.firmId, input.firmId));
      
      return restrictions;
    }),
});
