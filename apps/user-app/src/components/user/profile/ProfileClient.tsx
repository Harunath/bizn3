// components/user/profile/ProfileClient.tsx
"use client";

import { useEffect } from "react";
import {
	useUserStore,
	type ProfileProps,
	type ContactDetails,
} from "../../../lib/store/useUserStore";
import type {
	ProfilePropsWire,
	ContactDetailsWire,
} from "../../../lib/server/profile";
import ProfilePage from "./ProfilePage";

type Props = {
	initialUser: ProfilePropsWire | null; // <-- was ProfileProps
	initialContactDetails: ContactDetailsWire | null; // <-- was ContactDetails
};

// revive helpers (same as before)
function reviveDate(value: unknown) {
	if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
		const d = new Date(value);
		if (!Number.isNaN(d.getTime())) return d;
	}
	return value;
}
function reviveDeep<T>(obj: T): T {
	if (obj == null || typeof obj !== "object") return obj;
	if (Array.isArray(obj)) return obj.map(reviveDeep) as unknown as T;
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
		out[k] = v && typeof v === "object" ? reviveDeep(v) : reviveDate(v);
	}
	return out as T;
}

export default function ProfileClient({
	initialUser,
	initialContactDetails,
}: Props) {
	const { user, contactDetails, initialized, setFromInitial } = useUserStore();

	useEffect(() => {
		if (!initialized && initialUser) {
			const revivedUser = reviveDeep<ProfileProps>(
				initialUser as unknown as ProfileProps
			);
			const revivedContact = initialContactDetails
				? reviveDeep<ContactDetails>(
						initialContactDetails as unknown as ContactDetails
					)
				: null;

			setFromInitial(revivedUser, revivedContact);
		}
	}, [initialized, initialUser, initialContactDetails, setFromInitial]);

	const u = user;

	if (!u || !contactDetails) return <div className="p-4">Loading…</div>;

	return <ProfilePage user={u} contactDetailsRes={contactDetails || []} />;
}
