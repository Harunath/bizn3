import React from "react";
import SignOutButton from "../../../../components/common/SignOutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import ProfilePage from "../../../../components/user/profile/ProfilePage";
import prisma from "@repo/db/client";

const page = async () => {
	const session = await getServerSession(authOptions);
	if (!session || !session.user.id) {
		return (
			<div>
				<SignOutButton>
					<div className=" bg-red-600 min-w-20 p-2 rounded-full">Logout</div>
				</SignOutButton>
				failed to fetch user details
			</div>
		);
	}
	const res = await fetch(
		`${process.env.NEXTAUTH_URL}/api/user/${session.user.id}`
	);
	const data = await res.json();
	console.log(data.data);
	const user = data.data;

	const contactDetailsRes = await prisma.contactDetails.findUnique({
		where: { userId: user.id },
	});

	return (
		<div>
			<div className="flex items-center justify-between p-4 flex-wrap">
				<div className="flex-1 flex justify-center items-baseline-last gap-x-2 flex-wrap">
					<h1 className="text-3xl font-semibold flex items-center space-x-2">
						<span className="text-red-600">{session.user.firstname}</span>
						<span className="inline-flex items-center">
							Biz-<span className="text-black">Network</span>
							<span className="text-sm align-top ml-0.5">®</span>
						</span>
						<span>Profile</span>
					</h1>
				</div>
				<div className="w-fit">
					<SignOutButton>
						<div className=" bg-red-600 text-white min-w-20 p-2 rounded-full text-center">
							Logout
						</div>
					</SignOutButton>
				</div>
			</div>
			<ProfilePage
				user={user}
				contactDetailsRes={contactDetailsRes ? contactDetailsRes : null}
			/>
		</div>
	);
};

export default page;
