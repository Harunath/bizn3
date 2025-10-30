import prisma, { UserMembershipType } from "@repo/db/client";
import Link from "next/link";
import React from "react";

async function page({ params }: { params: Promise<{ chapterId: string }> }) {
	const { chapterId } = await params;
	const clubs = await prisma.club.findMany({
		where: { chapterId },
		select: { id: true },
	});
	const members = await prisma.user.findMany({
		where: {
			membershipType: UserMembershipType.VIP,
			homeClubId: { in: clubs.map((club) => club.id) },
		},
	});
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Chapter Members</h1>
			<ul className="list-disc pl-5">
				{members.map((member) => (
					<Link key={member.id} href={`./members/${member.id}`}>
						<li className="mb-2 text-blue-600 hover:underline cursor-pointer">
							{member.firstname} {member.lastname} - ({member.email})
						</li>
					</Link>
				))}
			</ul>
		</div>
	);
}

export default page;
