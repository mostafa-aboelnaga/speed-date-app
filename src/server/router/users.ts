import { createRouter } from "./context";
import { z } from "zod";

export const usersRouter = createRouter()
  .mutation("createUser", {
    input: z.object({
      name: z.string(),
      contactInfo: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      console.log(input);
      const createdUser = await ctx.prisma.speedDateUser.create({
        data: input,
      });
      return createdUser;
    },
  })
  .query("startDate", {
    input: z.object({
      userId: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const datingUser = await ctx.prisma.speedDateUser.findFirst({
        where: {
          status: "waiting",
          NOT: {
            id: input.userId,
          },
        },
      });

      if (!datingUser) return null;

      const date = await ctx.prisma.date.create({
        data: {
          sourceUserId: input.userId,
          sinkUserId: datingUser.id,
        },
      });

      return date;
    },
  })
  .query("getMyDate", {
    input: z.object({
      userId: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const date = await ctx.prisma.date.findFirst({
        where: {
          sinkUserId: input.userId,
        },
      });
      return date;
    },
  });
