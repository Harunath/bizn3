import "next-auth";
import { UserMembershipType } from "@repo/db/client";
declare module "next-auth" {
	interface User {
		id: string;
		email: string; // Explicitly define email as always available
		firstname: string;
		lastname: string;
		membershipType: UserMembershipType;
		businessId: null | string;
		registrationCompleted: boolean;
		homeClub: null | string;
	}

	interface Session {
		user: User; // Link the extended User type here
	}
}
