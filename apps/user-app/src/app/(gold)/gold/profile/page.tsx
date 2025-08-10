// app/user/profile/page.tsx (Server Component)
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import ProfileClient from "../../../../components/user/profile/ProfileClient"; // client component below
import SignOutButton from "../../../../components/common/SignOutButton";
import { getProfileByUserId } from "../../../../lib/server/profile";

export default async function Page() {
	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		return (
			<div className="p-4">
				<SignOutButton>
					<div className="bg-red-600 text-white min-w-20 p-2 rounded-full text-center">
						Logout
					</div>
				</SignOutButton>
				<p className="mt-2 text-red-600">Not authenticated</p>
			</div>
		);
	}

	const { user, contactDetails } = await getProfileByUserId(session.user.id);

	if (!user) {
		return <div className="p-4 text-red-600">User not found</div>;
	}

	return (
		<ProfileClient initialUser={user} initialContactDetails={contactDetails} />
	);
}
