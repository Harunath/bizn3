import React from "react";
import ProfilePage from "../../../../components/common/ProfilePage";
import SignOutButton from "../../../../components/common/SignOutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

const page = async () => {
	const session = await getServerSession(authOptions);
	console.log(session, " user session");
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
	console.log(`${process.env.NEXTAUTH_URL}/api/user`);
	console.log(res, "response");
	// if (!res.ok) {
	// 	return (
	// 		<div>
	// 			<SignOutButton>
	// 				<div className=" bg-red-600 min-w-20 p-2 rounded-full">Logout</div>
	// 			</SignOutButton>
	// 			failed to fetch user details
	// 		</div>
	// 	);
	// }
	const data = await res.json();
	console.log(data);
	const user = data.data;
	return (
		<div>
			<SignOutButton>
				<div className=" bg-red-600 min-w-20 p-2 rounded-full">Logout</div>
			</SignOutButton>
			<ProfilePage user={user} />
		</div>
	);
};

export default page;
