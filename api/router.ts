import { authRouter } from "./auth-router";
import { propFirmRouter } from "./propFirm-router";
import { calculatorRouter } from "./calculator-router";
import { countryRouter } from "./country-router";
import { educationRouter } from "./education-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  propFirm: propFirmRouter,
  calculator: calculatorRouter,
  country: countryRouter,
  education: educationRouter,
});

export type AppRouter = typeof appRouter;
