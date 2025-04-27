"use client";
import { IoArrowBack } from "react-icons/io5";

import { useRouter } from "next/navigation";

export default function BackButton() {
	const router = useRouter();

	return (
		<button onClick={() => router.back()}>
			<IoArrowBack />
		</button>
	);
}
