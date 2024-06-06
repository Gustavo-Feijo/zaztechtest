import { PrismaClient } from "@prisma/client";
// Export de uma instância do client do prisma para ser reutilizado na aplicação.
const prisma = new PrismaClient();
export default prisma;
