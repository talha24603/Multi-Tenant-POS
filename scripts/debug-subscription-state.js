const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();

  const tenants = await prisma.tenant.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      subscriptionStatus: true,
      subscriptionPlan: true,
      subscriptionEndDate: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const owner = await prisma.user.findUnique({
    where: { email: "owner@restaurant.com" },
    select: {
      id: true,
      email: true,
      stripeCustomerId: true,
      tenants: {
        select: {
          role: true,
          tenantId: true,
          tenant: {
            select: {
              name: true,
              status: true,
              subscriptionStatus: true,
              subscriptionPlan: true,
              subscriptionEndDate: true,
              stripeCustomerId: true,
              stripeSubscriptionId: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  console.log(
    JSON.stringify(
      {
        now: new Date().toISOString(),
        owner,
        tenants,
      },
      null,
      2
    )
  );

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

