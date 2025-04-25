import "next-auth";
import { FranchiseType } from "@repo/db/client";
declare module "next-auth" {
	interface User {
		id: string;
		email: string; // Explicitly define email as always available
		firstName: string;
		lastName?: string;
		isAdmin: boolean;
		isFranchiseAdmin: boolean;
		franchiseType?: FranchiseType;
	}

	interface Session {
		user: User; // Link the extended User type here
	}
}
