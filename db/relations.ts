import { relations } from "drizzle-orm";
import { propFirms, products, tradingRules, countryRestrictions, userFavorites } from "./schema";

export const propFirmRelations = relations(propFirms, ({ many }) => ({
  products: many(products),
  tradingRules: many(tradingRules),
  countryRestrictions: many(countryRestrictions),
  userFavorites: many(userFavorites),
}));

export const productRelations = relations(products, ({ one }) => ({
  firm: one(propFirms, {
    fields: [products.firmId],
    references: [propFirms.id],
  }),
}));

export const tradingRuleRelations = relations(tradingRules, ({ one }) => ({
  firm: one(propFirms, {
    fields: [tradingRules.firmId],
    references: [propFirms.id],
  }),
}));

export const countryRestrictionRelations = relations(countryRestrictions, ({ one }) => ({
  firm: one(propFirms, {
    fields: [countryRestrictions.firmId],
    references: [propFirms.id],
  }),
}));

export const userFavoriteRelations = relations(userFavorites, ({ one }) => ({
  firm: one(propFirms, {
    fields: [userFavorites.firmId],
    references: [propFirms.id],
  }),
}));
