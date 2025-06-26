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
			name,
			images,
			panNumber,
			panNumberVerified,
			tanNumber,
			gstNumber,
			gstNumberVerified,
			gstRegisteredState,
			verified,
			keywords,
			BusinessDescription,
			companyLogoUrl,
			generalCategory,
		} = body;

		if (!name || !images) {
			return NextResponse.json(
				{ message: "name, images are required" },
				{ status: 400 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { businessDetails: true },
		});

		if (!user) {
			return NextResponse.json(
				{ message: "user does not exist" },
				{ status: 400 }
			);
		}

		if (user.businessDetails?.id) {
			return NextResponse.json(
				{ message: "user business already exists" },
				{ status: 400 }
			);
		}

		const businessDetails = await prisma.businessDetails.create({
			data: {
				businessName: name,
				companyName: name || null,
				images,
				generalCategory: generalCategory || null,
				panNumber: panNumber || null,
				panNumberVerified: panNumberVerified ?? false,
				tanNumber: tanNumber || null,
				gstNumber: gstNumber || null,
				gstNumberVerified: gstNumberVerified ?? false,
				gstRegisteredState: gstRegisteredState || null,
				verified: verified ?? false,
				keywords: keywords || null,
				BusinessDescription: BusinessDescription || null,
				companyLogoUrl: companyLogoUrl || null,
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
			name,
			images,
			panNumber,
			panNumberVerified,
			tanNumber,
			gstNumber,
			gstNumberVerified,
			gstRegisteredState,
			verified,
			keywords,
			BusinessDescription,
			companyLogoUrl,
			generalCategory,
		} = body;

		console.log("generalCategory", generalCategory);

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
				businessName: name ?? business.businessName,
				companyName: name ?? business.companyName,
				images: images ?? business.images,
				generalCategory: generalCategory ?? business.generalCategory,
				panNumber: panNumber ?? business.panNumber,
				panNumberVerified: panNumberVerified ?? business.panNumberVerified,
				tanNumber: tanNumber ?? business.tanNumber,
				gstNumber: gstNumber ?? business.gstNumber,
				gstNumberVerified: gstNumberVerified ?? business.gstNumberVerified,
				gstRegisteredState: gstRegisteredState ?? business.gstRegisteredState,
				verified: verified ?? business.verified,
				keywords: keywords ?? business.keywords,
				BusinessDescription:
					BusinessDescription ?? business.BusinessDescription,
				companyLogoUrl: companyLogoUrl ?? business.companyLogoUrl,
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
