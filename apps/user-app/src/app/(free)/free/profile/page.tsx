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
					<div className="text-center md:text-left">
						<h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-x-1">
							<span className="text-red-600">Biz</span>
							<span className="text-black">-Network</span>
							<span className="text-sm align-top">®</span>
						</h1>

						<p className="text-gray-600 text-sm mt-1">
							Welcome back,{" "}
							<span className="font-semibold text-red-600">
								{session.user.firstname}
							</span>
						</p>
					</div>
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
