import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.toDo.create({
    data: {
      title: 'Learn how to use Prisma',
      details: 'Learn how to use Prisma to interact with your database',
    }, // Add type assertion here
  })
  const allToDo = await prisma.toDo.findMany()
  console.log(allToDo);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })