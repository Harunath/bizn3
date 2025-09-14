"use client";

import { useUser } from "./useUser";
import ProfileCard from "./ProfileCard";
import HomeClubEditor from "./HomeClubEditor";
import ClubsEditor from "./ClubsEditor";

export default function AdminUserDetail({ userId }: { userId: string }) {
	const { user, mutate, isLoading, error } = useUser(userId);

	if (isLoading)
		return <div className="p-6 text-sm text-zinc-500">Loading…</div>;
	if (error || !user)
		return <div className="p-6 text-sm text-red-600">Failed to load user.</div>;

	return (
		<div className="mx-auto max-w-5xl p-6 space-y-6">
			<h1 className="text-2xl font-semibold tracking-tight">
				User • <span className="text-zinc-500">{user.id}</span>
			</h1>

			<div className="grid gap-6 md:grid-cols-5">
				<div className="md:col-span-2">
					<ProfileCard user={user} onUpdated={() => mutate()} />
				</div>

				<div className="md:col-span-3 space-y-6">
					{/* <ChapterEditor
						userId={userId}
						current={user.chapter}
						onChanged={() => mutate()}
					/> */}
					<HomeClubEditor
						userId={userId}
						current={user.homeClub}
						chapterId={user.chapter?.id ?? null}
						onChanged={() => mutate()}
					/>
					<ClubsEditor
						userId={userId}
						clubs={user.clubs}
						onChanged={() => mutate()}
					/>
				</div>
			</div>
		</div>
	);
}
