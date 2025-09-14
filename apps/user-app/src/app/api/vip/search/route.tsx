// app/api/search/profiles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma, { Prisma, UserMembershipType } from "@repo/db/client";

export async function GET(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
	}

	// Your NextAuth session stores membership on the session.user; keep this check string-based.
	if (session.user.membershipType !== "VIP") {
		return NextResponse.json({ error: "VIP only" }, { status: 403 });
	}

	const { searchParams } = new URL(req.url);
	const q = (searchParams.get("q") || "").trim(); // name query (firstname/lastname)
	const category = (searchParams.get("category") || "").trim();
	const keywordsRaw = (searchParams.get("keywords") || "").trim();
	const sortBy = (searchParams.get("sortBy") || "relevance") as
		| "relevance"
		| "recent"
		| "name";
	const page = Math.max(1, Number(searchParams.get("page") || 1));
	const pageSize = Math.min(50, Number(searchParams.get("pageSize") || 20));

	const kw: string[] = keywordsRaw
		? keywordsRaw
				.split(/[,\s]+/)
				.map((x) => x.trim())
				.filter(Boolean)
		: [];

	const hasName = q.length > 0;
	const hasBizFilters = Boolean(category) || kw.length > 0 || Boolean(location);

	// ---------- helpers ----------
	const nameFilter: Prisma.UserWhereInput | undefined = hasName
		? {
				OR: [
					{ firstname: { contains: q, mode: "insensitive" } },
					{ lastname: { contains: q, mode: "insensitive" } },
				],
			}
		: undefined;

	const buildBusinessWhere = (): Prisma.BusinessDetailsWhereInput => {
		const and: Prisma.BusinessDetailsWhereInput[] = [];

		if (category) {
			// accept either category name or id
			and.push({
				OR: [
					{ category: { name: { equals: category, mode: "insensitive" } } },
					{ categoryId: category },
				],
			});
		}

		// if (kw.length) {
		// 	// --- M2M keywords pivot (rename these 3 identifiers to your actual relation names) ---
		// 	// relation on BusinessDetails: `keywordsOnBusinesses`
		// 	// pivot model has relation `keyword`, terminal model has field `name`
		// 	and.push({
		// 		keywords: {
		// 			contains: kw.map((k) => ({

		// 			})),
		// 		},
		// 	});
		// }

		return and.length ? { AND: and } : {};
	};

	const bizFilter: Prisma.BusinessDetailsWhereInput | undefined = hasBizFilters
		? buildBusinessWhere()
		: undefined;

	const baseUserFilter: Prisma.UserWhereInput = {
		membershipType: { equals: UserMembershipType.VIP },
	};

	const orderBy:
		| Prisma.UserOrderByWithRelationInput
		| Prisma.UserOrderByWithRelationInput[]
		| undefined =
		sortBy === "recent"
			? { createdAt: "desc" }
			: sortBy === "name"
				? [{ firstname: "asc" }, { lastname: "asc" }]
				: undefined;

	// ---------- 1) Name-only (fast path) ----------
	if (hasName && !hasBizFilters) {
		const where: Prisma.UserWhereInput = { ...baseUserFilter, ...nameFilter };

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				where,
				orderBy,
				skip: (page - 1) * pageSize,
				take: pageSize,
				select: {
					id: true,
					firstname: true,
					lastname: true,
					membershipType: true,
					profileImage: true,
					businessDetails: {
						select: {
							businessName: true,
							category: { select: { name: true } },
						},
					},
				},
			}),
			prisma.user.count({ where }),
		]);

		return NextResponse.json({
			data: users.map((u) => ({
				id: u.id,
				firstName: u.firstname,
				lastName: u.lastname,
				isVip: u.membershipType === "VIP",
				businessName: u.businessDetails?.businessName ?? null,
				category: u.businessDetails?.category?.name ?? null,
			})),
			total,
		});
	}

	// ---------- 2) Biz-only (filters with no name) ----------
	if (!hasName && hasBizFilters) {
		const where: Prisma.UserWhereInput = {
			...baseUserFilter,
			businessDetails: bizFilter,
		};

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				where,
				orderBy:
					sortBy === "recent"
						? { createdAt: "desc" }
						: sortBy === "name"
							? [{ firstname: "asc" }, { lastname: "asc" }]
							: [{ id: "asc" }], // deterministic fallback
				skip: (page - 1) * pageSize,
				take: pageSize,
				select: {
					id: true,
					firstname: true,
					lastname: true,
					membershipType: true,
					businessDetails: {
						select: {
							businessName: true,
							category: { select: { name: true } },
						},
					},
				},
			}),
			prisma.user.count({ where }),
		]);

		return NextResponse.json({
			data: users.map((u) => ({
				id: u.id,
				firstName: u.firstname,
				lastName: u.lastname,
				isVip: u.membershipType === "VIP",
				businessName: u.businessDetails?.businessName ?? null,
				category: u.businessDetails?.category?.name ?? null,
			})),
			total,
		});
	}

	// ---------- 3) Mixed (name + biz filters) ----------
	const whereMixed: Prisma.UserWhereInput = {
		...baseUserFilter,
		...(nameFilter ?? {}),
		...(bizFilter ? { businessDetails: bizFilter } : {}),
	};

	const [users, total] = await Promise.all([
		prisma.user.findMany({
			where: whereMixed,
			orderBy,
			skip: (page - 1) * pageSize,
			take: pageSize,
			select: {
				id: true,
				firstname: true,
				lastname: true,
				membershipType: true,
				businessDetails: {
					select: {
						businessName: true,
						category: { select: { name: true } },
					},
				},
			},
		}),
		prisma.user.count({ where: whereMixed }),
	]);

	return NextResponse.json({
		data: users.map((u) => ({
			id: u.id,
			firstName: u.firstname,
			lastName: u.lastname,
			isVip: u.membershipType === "VIP",
			businessName: u.businessDetails?.businessName ?? null,
			category: u.businessDetails?.category?.name ?? null,
		})),
		total,
	});
}
