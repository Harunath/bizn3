import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { authOptions } from "../../../../../lib/auth";

export const GET = async () => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}

		const business = await prisma.businessDetails.findUnique({
			where: { userId: session.user.id },
		});

		if (!business) {
			return NextResponse.json(
				{ message: "business does not exist" },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ message: "success", data: business },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const {
			businessName,
			images,
			panNumber,
			panNumberVerified,
			tanNumber,
			gstNumber,
			gstNumberVerified,
			gstRegisteredState,
			verified,
			companyName,
			companyLogoUrl,
			BusinessDescription,
			keywords,
			generalCategory,
		} = body;

		if (!businessName || !Array.isArray(images)) {
			return NextResponse.json(
				{ message: "businessName and images[] are required" },
				{ status: 400 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { businessDetails: true },
		});

		if (!user || user.businessDetails?.id) {
			return NextResponse.json(
				{ message: "user business already exists or not found" },
				{ status: 400 }
			);
		}

		const businessDetails = await prisma.businessDetails.create({
			data: {
				businessName,
				images,
				panNumber: panNumber || null,
				panNumberVerified: !!panNumberVerified,
				tanNumber: tanNumber || null,
				gstNumber: gstNumber || null,
				gstNumberVerified: !!gstNumberVerified,
				gstRegisteredState: gstRegisteredState || null,
				verified: !!verified,
				companyName: companyName || null,
				companyLogoUrl: companyLogoUrl || null,
				BusinessDescription: BusinessDescription || null,
				keywords: keywords || null,
				generalCategory: generalCategory || null,
				user: { connect: { id: session.user.id } },
			},
		});

		return NextResponse.json(
			{ message: "success", data: businessDetails },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const PUT = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const {
			businessName,
			images,
			panNumber,
			panNumberVerified,
			tanNumber,
			gstNumber,
			gstNumberVerified,
			gstRegisteredState,
			verified,
			companyName,
			companyLogoUrl,
			BusinessDescription,
			keywords,
			generalCategory,
			categoryId,
		} = body;

		const business = await prisma.businessDetails.findUnique({
			where: { userId: session.user.id },
		});

		if (!business) {
			return NextResponse.json(
				{ message: "business does not exist" },
				{ status: 400 }
			);
		}

		const updated = await prisma.businessDetails.update({
			where: { id: business.id },
			data: {
				businessName: businessName ?? business.businessName,
				images: Array.isArray(images) ? images : business.images,
				panNumber: panNumber ?? business.panNumber,
				panNumberVerified:
					typeof panNumberVerified === "boolean"
						? panNumberVerified
						: business.panNumberVerified,
				tanNumber: tanNumber ?? business.tanNumber,
				gstNumber: gstNumber ?? business.gstNumber,
				gstNumberVerified:
					typeof gstNumberVerified === "boolean"
						? gstNumberVerified
						: business.gstNumberVerified,
				gstRegisteredState: gstRegisteredState ?? business.gstRegisteredState,
				verified: typeof verified === "boolean" ? verified : business.verified,
				companyName: companyName ?? business.companyName,
				companyLogoUrl: companyLogoUrl ?? business.companyLogoUrl,
				BusinessDescription:
					BusinessDescription ?? business.BusinessDescription,
				keywords: keywords ?? business.keywords,
				generalCategory: generalCategory ?? business.generalCategory,
				categoryId: categoryId ?? business.categoryId,
			},
		});

		return NextResponse.json(
			{ message: "update success", data: updated },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
