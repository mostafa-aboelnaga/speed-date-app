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
        data: input as any,
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
          status: "waiting",
        },
      });

      return date;
    },
  })
  .query("getDate", {
    input: z.object({
      userId: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const date = await ctx.prisma.date.findFirst({
        where: {
          sinkUserId: input.userId,
          status: "waiting",
        },
      });
      return date;
    },
  })
  .mutation("setStatus", {
    input: z.object({
      userId: z.string(),
      status: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      await ctx.prisma.speedDateUser.update({
        where: {
          id: input.userId,
        },
        data: {
          status: input.status,
        },
      });
    },
  });
