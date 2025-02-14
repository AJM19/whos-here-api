import { Prisma } from "@prisma/client";
import prisma from "../src/prisma";

async function main() {
  console.log("🌱 Seeding squares...");

  const defaultSquares: Prisma.SquareCreateManyInput[] = Array.from(
    { length: 900 },
    (_, i) => ({
      id: i + 1,
      value: "",
    }),
  );

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
