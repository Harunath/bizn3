import React from "react";
import RegisterSteps from "../../../components/auth/Register/RegisterSteps";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";

import { User, BusinessDetails, Club } from "@repo/db/client";
export interface RegisterUserProps
	extends Omit<
		User,
		| "password"
		| "membershipStartDate"
		| "membershipEndDate"
		| "leadingChapterId"
		| "leadingClubId"
	> {
	businessDetails: BusinessDetails | null;
	homeClub: Club | null;
}

const page = async () => {
	const session = await getServerSession(authOptions);
	if (session && session?.user && session.user.id) {
		console.log("inside", session);

		const user: RegisterUserProps | null = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				email: true,
				emailVerified: true,
				phone: true,
				phoneVerified: true,
				registrationCompleted: true,
				firstname: true,
				lastname: true,
				profileImage: true,
				deleted: true,
				deactivated: true,
				businessDetails: true,
				membershipType: true,
				homeClubId: true,
				homeClub: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		console.log(user);
		if (!user) {
			redirect("/logout");
		} else if (user && !user.registrationCompleted) {
			console.log("registration not finished");
			return (
				<div>
					<RegisterSteps user={user} session={session} />
				</div>
			);
		} else if (user && user.registrationCompleted) redirect("/logout");
	}
	return (
		<div>
			<RegisterSteps />
		</div>
	);
};

export default page;
