import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { educationalContent } from "@db/schema";
import { eq, asc } from "drizzle-orm";

export const educationRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const results = await db
      .select()
      .from(educationalContent)
      .orderBy(asc(educationalContent.orderIndex));
    
    return results.map(item => ({
      ...item,
      content: item.content ? JSON.parse(item.content) : null,
    }));
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [result] = await db
        .select()
        .from(educationalContent)
        .where(eq(educationalContent.slug, input.slug));
      
      if (!result) return null;
      
      return {
        ...result,
        content: result.content ? JSON.parse(result.content) : null,
      };
    }),
});
