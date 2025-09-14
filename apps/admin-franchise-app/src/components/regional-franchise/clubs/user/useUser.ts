"use client";
import useSWR from "swr";

const fetcher = (url: string) =>
	fetch(url).then((r) => {
		if (!r.ok) throw new Error("Request failed");
		return r.json();
	});

export function useUser(userId: string) {
	const { data, error, mutate, isLoading } = useSWR(
		`/api/user/${userId}`,
		fetcher
	);
	return { user: data?.user, mutate, isLoading, error };
}
