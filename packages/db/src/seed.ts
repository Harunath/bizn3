import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import categories from "./Biz-Network Categories";

async function main() {
	for (const category of categories) {
		await prisma.businessCategory.upsert({
			where: { name: category.name },
			update: {},
			create: { name: category.name },
		});
	}
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
