import { createRouter } from "./context";
import { z } from "zod";

export const datesRouter = createRouter().query("getDateUsers", {
  input: z.object({
    dateId: z.string(),
  }),
  resolve: async ({ input, ctx }) => {
    return await ctx.prisma.date.findUnique({
      where: {
        id: input.dateId,
      },
      include: {
        sinkUser: true,
        sourceUser: true,
      },
    });
  },
});
