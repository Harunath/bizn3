import React from "react";
import SignOutButton from "../../../../components/common/SignOutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import ProfilePage from "../../../../components/user/profile/ProfilePage";

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
	return (
		<div>
			<div className="flex items-center justify-between p-4">
				<div className="flex-1 flex items-center justify-center gap-x-2">
					<h1 className="text-4xl font-medium text-center">
						Biz network Profile
					</h1>
					<span className="text-5xl font-semibold text-red-600">
						{session.user.firstname}
					</span>
				</div>
				<div className="w-fit">
					<SignOutButton>
						<div className=" bg-red-600 min-w-20 p-2 rounded-full text-center">
							Logout
						</div>
					</SignOutButton>
				</div>
			</div>

			<ProfilePage user={user} />
		</div>
	);
};

export default page;
