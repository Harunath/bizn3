import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth"; // Your NextAuth config
import Navbar from "../../components/common/NavBar";
import { UserMembershipType } from "@repo/db/client";
import BackButton from "@repo/ui/BackButton";
import WithRole from "../../hoc/WithRole";

export default async function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await getServerSession(authOptions); // Fetch session on the server
	const links = [
		{ name: "Dashboard", href: "/free/dashboard" },
		{ name: "Profile", href: "/free/profile" },
	];

	return (
		<WithRole allowedRole={UserMembershipType.FREE} session={session}>
			<div className=" w-screen bg-white text-black">
				<Navbar links={links} />
				<div className="pt-16 px-2">
					<BackButton />
					{children}
				</div>
			</div>
		</WithRole>
	);
}
