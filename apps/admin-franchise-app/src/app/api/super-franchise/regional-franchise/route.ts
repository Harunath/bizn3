// src/app/api/admin/franchise/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma, { FranchiseType } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function GET() {
	try {
		const franchises = await prisma.franchise.findMany({
			where: { franchiseType: FranchiseType.REGIONAL_FRANCHISE },
			select: {
				id: true,
				businessName: true,
				address: true,
				logo: true,
				motto: true,
				gstNumber: true,
				gstNumberVerified: true,
				panNumber: true,
				panNumberVerified: true,

				// Business entity details
				startDate: true,
				endDate: true,
				renewalPeriod: true,
				isActive: true,
				isActiveDescription: true,
				franchiseType: true,

				// Admin relationship
				franchiseAdmin: {
					select: {
						firstName: true,
						lastName: true,
						id: true,
					},
				},

				// Master Franchise specific
				regionId: true,
				region: {
					select: {
						name: true,
						id: true,
						code: true,
					},
				},

				createdAt: true,
				updatedAt: true,
			},
		});
		if (franchises.length == 0) {
			return NextResponse.json(
				{ message: "success", franchises: [] },
				{ status: 200 }
			);
		}
		return NextResponse.json(
			{ message: "success", franchises },
			{ status: 200 }
		);
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		console.log(session);
		if (
			!session ||
			!session?.user ||
			session.user.franchiseType != FranchiseType.SUPER_FRANCHISE
		) {
			return NextResponse.json({ message: "unauthorized" }, { status: 403 });
		}

		const data = await req.json();
		const { businessName, regionId } = data;
		if (!businessName || !regionId) {
			return NextResponse.json(
				{ message: "businessName or franchiseType does not exist" },
				{ status: 400 }
			);
		}
		const startDate = new Date();
		const endDate = new Date(startDate);
		endDate.setFullYear(startDate.getFullYear() + 5);
		const renewalDate = new Date(startDate);
		renewalDate.setFullYear(startDate.getFullYear() + 1);
		const newFranchise = await prisma.franchise.create({
			data: {
				businessName: businessName,
				startDate,
				endDate,
				renewalPeriod: 1,
				renewalDate,
				isActive: true,
				franchiseType: FranchiseType.REGIONAL_FRANCHISE,
				regionId: regionId,
				parentFranchiseAdminId: session.user.id,
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
