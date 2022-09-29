import { createRouter } from "./context";
import { z } from "zod";
import { RtcRole, RtcTokenBuilder } from "agora-access-token";

export const datesRouter = createRouter()
  .query("getFullDate", {
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
  })
  .query("getToken", {
    input: z.object({
      userId: z.string(),
      dateId: z.string(),
    }),
    resolve: async ({ input }) => {
      // Rtc Examples
      const appID = process.env.AGORA_APP_ID!;
      const appCertificate = process.env.AGORA_APP_CERTIFICATE!;
      const channelName = input.dateId;
      const account = input.userId;
      const role = RtcRole.PUBLISHER;
      const expirationTimeInSeconds = 3600;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

      // Build token with user account
      const token = RtcTokenBuilder.buildTokenWithAccount(
        appID,
        appCertificate,
        channelName,
        account,
        role,
        privilegeExpiredTs,
      );

      return token;
    },
  })
  .mutation("joinDate", {
    input: z.object({
      dateId: z.string(),
      userId: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const date = await ctx.prisma.date.findUnique({
        where: {
          id: input.dateId,
        },
      });

      const isSinkUser = date?.sinkUserId === input.userId;
      const updatedDate = await ctx.prisma.date.update({
        where: {
          id: input.dateId,
        },
        data: {
          [isSinkUser ? "sinkUserJoined" : "sourceUserJoined"]: true,
        },
      });

      if (updatedDate.sinkUserJoined && updatedDate.sourceUserJoined) {
        await ctx.prisma.date.update({
          where: {
            id: input.dateId,
          },
          data: {
            status: "ongoing",
            endsOn: `${Date.now() + 20 * 1000}`,
          },
        });
      }
    },
  })
  .mutation("postFeedback", {
    input: z.object({
      dateId: z.string(),
      userId: z.string(),
      status: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const date = await ctx.prisma.date.findUnique({
        where: {
          id: input.dateId,
        },
      });

      const isSinkUser = date?.sinkUserId === input.userId;
      await ctx.prisma.date.update({
        where: {
          id: input.dateId,
        },
        data: {
          [isSinkUser ? "sinkUserFeedback" : "sourceUserFeedback"]:
            input.status,
        },
      });
    },
  });
