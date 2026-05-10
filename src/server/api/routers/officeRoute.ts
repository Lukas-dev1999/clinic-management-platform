/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Roles } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const officeRouter = createTRPCRouter({
  getRole: publicProcedure
    .input(z.object({ input: z.string() }))
    .query(async ({ input, ctx }) => {
      const roles = await ctx.prisma.user.findUnique({
        where: {
          id: input.input,
        },
        select: {
          roles: true,
          roleInOffice: true,
        },
      });

      return roles;
    }),
  setRole: protectedProcedure
    .input(z.object({ input: z.string(), role: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const roleString: string = input.role;
      const typedRoleString = roleString as keyof typeof Roles;
      const roles = await ctx.prisma.user.update({
        where: {
          id: input.input,
        },
        data: {
          roles: Roles[typedRoleString],
        },
      });

      return roles;
    }),

  getAllUsers: protectedProcedure.query(async ({ ctx: { prisma } }) => {
    return prisma.user.findMany({
      select: {
        name: true,
        id: true,
        email: true,
        roles: true,
      },
    });
  }),

  createOffice: protectedProcedure
    .input(z.object({ input: z.string() }))
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const self = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (self?.roles !== "SystemAdmin" && self?.roles !== "SuperAdmin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "YOU ARE NOT AUTHORIZED TO VIEW THIS PAGE",
        });
      }

      return prisma.office.create({
        data: {
          name: input.input,
        },
      });
    }),

  getAllOffices: protectedProcedure.query(async ({ ctx: { prisma } }) => {
    return prisma.office.findMany();
  }),

  getOffice: protectedProcedure
    .input(z.string())
    .query(async ({ ctx: { prisma }, input }) => {
      return prisma.office.findUnique({
        where: {
          id: input,
        },
        select: {
          id: true,
          name: true,
          users: true,
        },
      });
    }),

  deleteOffice: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const self = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (self?.roles !== "SystemAdmin" && self?.roles !== "SuperAdmin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "YOU ARE NOT AUTHORIZED TO VIEW THIS PAGE",
        });
      }

      return prisma.office.delete({
        where: {
          id: input,
        },
      });
    }),

  addUserToOffice: protectedProcedure
    .input(
      z.object({ officeId: z.string(), userId: z.string(), role: z.string() })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const self = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (self?.roles === "Patient") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized action",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      if (user?.officeId && user?.officeId !== input.officeId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is already in an office",
        });
      }

      const updateOffice = await prisma.office.update({
        where: {
          id: input.officeId,
        },
        data: {
          users: {
            connect: {
              id: input.userId,
            },
          },
        },
      });

      const typedRoleString = input.role as keyof typeof Roles;

      if (updateOffice) {
        return prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            roleInOffice: Roles[typedRoleString],
          },
        });
      }
    }),
  removeUserFromOffice: protectedProcedure
    .input(
      z.object({ officeId: z.string(), userId: z.string(), role: z.string() })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const self = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (
        self?.roles !== "SystemAdmin" &&
        self?.roles !== "SuperAdmin" &&
        self?.roles !== "TenantAdmin"
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "YOU ARE NOT AUTHORIZED TO VIEW THIS PAGE",
        });
      }

      const updateOffice = await prisma.office.update({
        where: {
          id: input.officeId,
        },
        data: {
          users: {
            disconnect: {
              id: input.userId,
            },
          },
        },
      });

      if (updateOffice) {
        return prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            roleInOffice: undefined,
          },
        });
      }
    }),

  getJoinedOffices: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      const joinedOffice = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          officeId: true,
        },
      });

      return prisma.office.findUnique({
        where: {
          id: joinedOffice?.officeId as string,
        },
        select: {
          id: true,
          name: true,
          users: true,
        },
      });
    }
  ),

  getSelf: protectedProcedure
    .input(z.string())
    .query(async ({ ctx: { prisma }, input }) => {
      const self = await prisma.user.findUnique({
        where: {
          id: input,
        },
      });

      return self;
    }),

  addToTable: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const self = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      // Input string

      // Extract text between hashtags
      const match = input.match(/#(.*?)#/);

      let actionString = input;

      // Convert extracted text to uppercase
      if (match) {
        const extractedText = match[1];

        const inputString = input;

        const interactedWithUser = await prisma.user.findUnique({
          where: {
            id: extractedText,
          },
        });

        // Replace original hashtag with name associated wtih ID and remove hashtags
        actionString = inputString
          .replace(match[0], interactedWithUser?.name as string)
          .replace(/#/g, "");

      }

      const createAction = await prisma.actions.create({
        data: {
          actionTakerId: self?.name as string,
          actionDescription: actionString,
        },
      });

      return createAction;
    }),

  getActions: protectedProcedure.query(async ({ ctx: { session, prisma } }) => {
    const self = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (self?.roles !== "SuperAdmin" && self?.roles !== "SystemAdmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "YOU ARE NOT AUTHORIZED TO VIEW THIS PAGE",
      });
    }
    return prisma.actions.findMany({
      orderBy: {
        actionTime: "desc",
      },
    });
  }),

  clearActionLog: protectedProcedure.mutation(
    async ({ ctx: { session, prisma } }) => {
      const self = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (self?.roles !== "SuperAdmin" && self?.roles !== "SystemAdmin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "YOU ARE NOT AUTHORIZED TO VIEW THIS PAGE",
        });
      }
      return prisma.actions.deleteMany();
    }
  ),
});
