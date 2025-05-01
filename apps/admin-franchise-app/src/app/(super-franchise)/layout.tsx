import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth"; // Your NextAuth config
import WithRole from "../../hoc/WithRole";
import Navbar from "../../components/common/NavBar";
import { FranchiseType } from "@repo/db/client";
import BackButton from "@repo/ui/BackButton";

export default async function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await getServerSession(authOptions); // Fetch session on the server
	const links = [
		{ name: "Dashboard", href: "/super-franchise/dashboard" },
		{ name: "profile", href: "/super-franchise/profile" },
	];

	return (
		<WithRole allowedRole={FranchiseType.SUPER_FRANCHISE} session={session}>
			<div className=" w-screen">
				<Navbar links={links} />
				<div className="pt-16 px-2">
					<BackButton />
					{children}
				</div>
			</div>
		</WithRole>
	);
}
