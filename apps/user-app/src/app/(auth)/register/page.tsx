import React from "react";
import RegisterSteps from "../../../components/auth/Register/RegisterSteps";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";

import { User, BusinessDetails, Club } from "@repo/db/client";
import Register from "../../../components/auth/Register/Register";
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
		console.log("user ", user?.firstname);
		if (!user) {
			redirect("/logout");
		} else if (user && !user.registrationCompleted) {
			return (
				<div>
					<RegisterSteps user={user} session={session} />
				</div>
			);
		} else if (user && user.registrationCompleted) redirect("/logout");
	}
	if (!session) {
		return <Register />;
	}
};

export default page;
