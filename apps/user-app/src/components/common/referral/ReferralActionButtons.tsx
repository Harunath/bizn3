"use client";
import { useTransition } from "react";
import { ReferralStatus } from "@repo/db/client";
import { StatusUpdateAction } from "../../../app/action/referral/StatusUpdateAction";
import { toast } from "react-toastify";
import { TiDelete, TiTick } from "react-icons/ti";

export default function ReferralActionButtons({ id }: { id: string }) {
	const [isPending, startTransition] = useTransition();

	const handleAction = (status: ReferralStatus) => {
		startTransition(async () => {
			try {
				await StatusUpdateAction(id, status);
				toast.success(`Referral ${status.toLowerCase()}`);
			} catch {
				toast.error("Failed to update status");
			}
		});
	};

	return (
		<div className="flex gap-2 items-center justify-start">
			<button
				onClick={() => handleAction(ReferralStatus.ACCEPTED)}
				disabled={isPending}>
				<TiTick className="h-6 w-6 text-green-500" />
			</button>
			<button
				onClick={() => handleAction(ReferralStatus.REJECTED)}
				disabled={isPending}>
				<TiDelete className="h-6 w-6 text-red-500" />
			</button>
		</div>
	);
}
