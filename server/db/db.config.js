import { PrismaClient } from "@prisma/client";

const prisma = PrismaClient({
   log: ['query' , 'error']
});

export default prisma;
