import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { quoteRouter } from "./routers/quote";
import { communityRouter } from "./routers/community";
import { crmRouter } from "./routers/crm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Quote / RFQ feature
  quote: quoteRouter,

  // Community PCB showcase
  community: communityRouter,

  // CRM: Customer / Lead / RFQ / Quote / Project / Invoice
  crm: crmRouter,
});

export type AppRouter = typeof appRouter;
