import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const teresa = await prisma.member.upsert({
    where: { id: "93d6b2ae-670c-46f4-9595-f9f74b6afcd3" },
    update: {},
    create: {
      email: "tqwu@ucsc.edu",
      name: "Teresa Wu",
    },
  });
  const lily = await prisma.member.upsert({
    where: { id: "8ef1a338-3d86-44ce-b53d-faae238f6978" },
    update: {},
    create: {
      email: "lknab@ucsc.edu",
      name: "Lily Knab",
    },
  });
  const furkan = await prisma.member.upsert({
    where: { id: "0741aad2-8a6d-4e17-90e6-b3f841cadb3f" },
    update: {},
    create: {
      email: "fercevik@ucsc.edu",
      name:"Furkan Ercevik",
    },
  });
  const oscar = await prisma.member.upsert({
    where: { id: "ea6105ab-4dd6-4f9d-a500-69c1a5802bc1" },
    update: {},
    create: {
      email: "oluthje@ucsc.edu",
      name: "Oscar Luthje",
    },
  });
  const ahmad = await prisma.member.upsert({
    where: { id: "198841c8-3f12-47af-b97d-b7fa5b70d4ee" },
    update: {},
    create: {
      email: "aajoseph@ucsc.edu",
      name:"Ahmad Joseph",
    },
  });

  console.log({ teresa, lily, furkan, ahmad, oscar });
}

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
