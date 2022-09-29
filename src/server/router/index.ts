// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { usersRouter } from "./users";
import { datesRouter } from "./dates";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("users.", usersRouter)
  .merge("dates.", datesRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
