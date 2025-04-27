"use client";
import { IoReturnUpBackSharp } from "react-icons/io5";

import { useRouter } from "next/navigation";

export default function ParentButton({ parent }: { parent: string }) {
	const router = useRouter();

	return (
		<button onClick={() => router.push(`/${parent}`)}>
			<IoReturnUpBackSharp />
		</button>
	);
}
