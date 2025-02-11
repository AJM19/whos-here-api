import { Prisma } from "@prisma/client";
import prisma from "../src/prisma";

async function main() {
  console.log("🌱 Seeding squares...");

  const defaultSquares: Prisma.SquareCreateManyInput[] = new Array(900).fill({
    value: false,
  });

  await prisma.square.createMany({
    data: [...defaultSquares],
  });

  console.log("🌱 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
