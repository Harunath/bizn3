import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth"; // Your NextAuth config
import WithAdmin from "../../hoc/WithAdmin";
import Navbar from "../../components/common/NavBar";
import BackButton from "@repo/ui/BackButton";

export default async function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await getServerSession(authOptions); // Fetch session on the server
	const links = [
		{ name: "Dashboard", href: "/admin/dashboard" },
		{ name: "profile", href: "/admin/profile" },
	];

	return (
		<WithAdmin session={session}>
			<div className=" w-screen">
				<Navbar links={links} />

				<div className="pt-16 px-2">
					<BackButton />
					{children}
				</div>
			</div>
		</WithAdmin>
	);
}
