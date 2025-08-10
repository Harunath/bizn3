"use client";
import { useTransition } from "react";
import { ReferralStatus } from "@repo/db/client";
import { StatusUpdateAction } from "../../../lib/action/referral/StatusUpdateAction";
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
			<p>Action :</p>
			<div className="flex gap-4 items-center justify-start">
				<button
					onClick={() => handleAction(ReferralStatus.ACCEPTED)}
					disabled={isPending}>
					<TiTick className="h-6 w-6 text-green-500" />{" "}
					<span className=" text-green-500">Accept</span>
				</button>
				<button
					onClick={() => handleAction(ReferralStatus.REJECTED)}
					disabled={isPending}>
					<TiDelete className="h-6 w-6 text-red-500" />
					<span className="text-red-500">Reject</span>
				</button>
			</div>
		</div>
	);
}
