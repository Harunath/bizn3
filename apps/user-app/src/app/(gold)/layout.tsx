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
		{ name: "Dashboard", href: "/gold/dashboard" },
		{ name: "Profile", href: "/gold/profile" },
	];

	return (
		<WithRole allowedRole={UserMembershipType.GOLD} session={session}>
			<div className="min-h-screen w-screen">
				<Navbar links={links} />
				<div className="pt-16 px-2">
					<BackButton />
					{children}
				</div>
			</div>
		</WithRole>
	);
}
