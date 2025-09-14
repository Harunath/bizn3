import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export const FASessionOrThrow = async () => {
	const session = await getServerSession(authOptions);
	console.log("role check session", session);
	if (!session?.user || !session.user.isFranchiseAdmin) {
		throw new Response("Forbidden", { status: 403 });
	}
	return session;
};

export const adminSessionOrThrow = async () => {
	const session = await getServerSession(authOptions);
	if (!session?.user || session.user.isAdmin) {
		throw new Response("Forbidden", { status: 403 });
	}
	return session;
};
