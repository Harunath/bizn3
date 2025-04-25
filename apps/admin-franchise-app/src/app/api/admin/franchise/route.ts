// src/app/api/admin/franchise/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();
		const {
			businessName,
			renewalPeriod,
			franchiseType,
			countryId,
			zoneId,
			regionId,
		} = data;
		if (!businessName || !franchiseType) {
			return NextResponse.json(
				{ message: "businessName or franchiseType does not exist" },
				{ status: 400 }
			);
		}
		const startDate = new Date();
		const endDate = new Date(startDate);
		endDate.setFullYear(startDate.getFullYear() + 5);
		const newFranchise = await prisma.franchise.create({
			data: {
				businessName: businessName,
				startDate,
				endDate,
				renewalPeriod: renewalPeriod || 1,
				isActive: true,
				franchiseType: franchiseType,
				countryId: countryId || undefined,
				zoneId: zoneId || undefined,
				regionId: regionId || undefined,
			},
		});

		return NextResponse.json(newFranchise, { status: 201 });
	} catch (error) {
		console.error("[FRANCHISE_CREATE_ERROR]", error);
		return NextResponse.json(
			{ error: "Failed to create franchise" },
			{ status: 500 }
		);
	}
}
