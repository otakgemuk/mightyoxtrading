import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Prop Firms table
export const propFirms = mysqlTable("prop_firms", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  tagline: varchar("tagline", { length: 500 }),
  description: text("description"),
  logoUrl: varchar("logo_url", { length: 500 }),
  websiteUrl: varchar("website_url", { length: 500 }),
  affiliateUrl: varchar("affiliate_url", { length: 500 }),
  foundedYear: int("founded_year"),
  platforms: json("platforms").$type<string[]>(),
  payoutSchedule: varchar("payout_schedule", { length: 100 }),
  profitSplit: varchar("profit_split", { length: 50 }),
  trustScore: decimal("trust_score", { precision: 3, scale: 1 }),
  bestForTags: json("best_for_tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export type PropFirm = typeof propFirms.$inferSelect;
export type InsertPropFirm = typeof propFirms.$inferInsert;

// Products table (account tiers)
export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  firmId: bigint("firm_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => propFirms.id),
  name: varchar("name", { length: 255 }).notNull(),
  accountSize: int("account_size").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  profitTarget: decimal("profit_target", { precision: 5, scale: 2 }).notNull(),
  dailyDrawdown: decimal("daily_drawdown", { precision: 5, scale: 2 }).notNull(),
  maxDrawdown: decimal("max_drawdown", { precision: 5, scale: 2 }).notNull(),
  minimumDays: int("minimum_days").default(0),
  consistencyRule: text("consistency_rule"),
  resetFee: decimal("reset_fee", { precision: 10, scale: 2 }).default("0"),
  activationFee: decimal("activation_fee", { precision: 10, scale: 2 }).default("0"),
  monthlyFee: decimal("monthly_fee", { precision: 10, scale: 2 }).default("0"),
  phase2Required: boolean("phase2_required").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Trading Rules table
export const tradingRules = mysqlTable("trading_rules", {
  id: serial("id").primaryKey(),
  firmId: bigint("firm_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => propFirms.id),
  category: mysqlEnum("category", [
    "allowed",
    "prohibited",
    "payout_invalidation",
    "live_specific",
  ]).notNull(),
  rule: text("rule").notNull(),
  detail: text("detail"),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("info"),
  orderIndex: int("order_index").default(0),
});

export type TradingRule = typeof tradingRules.$inferSelect;
export type InsertTradingRule = typeof tradingRules.$inferInsert;

// Country Restrictions table
export const countryRestrictions = mysqlTable("country_restrictions", {
  id: serial("id").primaryKey(),
  firmId: bigint("firm_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => propFirms.id),
  countryCode: varchar("country_code", { length: 2 }).notNull(),
  countryName: varchar("country_name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["allowed", "restricted", "restricted_live_only"]).notNull(),
  notes: text("notes"),
});

export type CountryRestriction = typeof countryRestrictions.$inferSelect;
export type InsertCountryRestriction = typeof countryRestrictions.$inferInsert;

// User Favorites (for registered users)
export const userFavorites = mysqlTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  firmId: bigint("firm_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => propFirms.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = typeof userFavorites.$inferInsert;

// Educational Content
export const educationalContent = mysqlTable("educational_content", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  content: text("content").notNull(),
  orderIndex: int("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});