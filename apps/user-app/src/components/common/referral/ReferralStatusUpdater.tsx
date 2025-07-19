"use client";
import { useState, useTransition } from "react";
import { ReferralType } from "./GetReferrals";
import { ReferralStatus } from "@repo/db/client";
import { StatusUpdateAction } from "../../../app/action/referral/StatusUpdateAction";
import { toast } from "react-toastify";

export default function ReferralStatusUpdater({
	referral,
}: {
	referral: ReferralType;
}) {
	const [status, setStatus] = useState(referral.status);
	const [isPending, startTransition] = useTransition();

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newStatus = e.target.value as ReferralStatus;

		startTransition(async () => {
			try {
				await StatusUpdateAction(referral.id, newStatus);
				setStatus(newStatus);
				toast.success("Status updated");
			} catch (err) {
				console.error(err);
				toast.error("Failed to update status");
			}
		});
	};

	// Hide dropdown if status is COMPLETED

	if (status !== ReferralStatus.WAITING) {
		return (
			<div className="flex gap-2 items-center justify-start">
				<select
					value={status}
					onChange={handleChange}
					disabled={isPending}
					className="border rounded px-2 py-1 bg-white">
					<option disabled>Update Status</option>
					<option
						value={ReferralStatus.IN_PROGRESS}
						disabled={status === ReferralStatus.IN_PROGRESS}>
						In Progress
					</option>

					<option value={ReferralStatus.COMPLETED}>Completed</option>
				</select>
			</div>
		);
	} else {
		return null;
	}
}
