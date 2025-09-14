import { z } from "zod";

// Minimal user projection your API returns.
// Add/remove fields to match your actual User schema.
export const ClubUserSchema = z.object({
	id: z.string(),
	firstname: z.string().nullable().optional(),
	lastname: z.string().nullable().optional(),
	email: z.string().email().nullable().optional(),
	profileImage: z.string().url().nullable().optional(),
	homeClubId: z.string().nullable().optional(),
});

export const ChapterLiteSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const ClubDetailSchema = z.object({
	id: z.string(),
	name: z.string(),
	code: z.string(),
	description: z.string().nullable().optional(),
	images: z.array(z.string()),
	chapterId: z.string(),
	chapter: ChapterLiteSchema.nullable().optional(),
	createdAt: z.string(), // ISO date from JSON
	updatedAt: z.string(), // ISO date from JSON
	counts: z.object({
		members: z.number(),
		homeClubMembers: z.number(),
	}),
	members: z.array(ClubUserSchema),
	homeClubMembers: z.array(ClubUserSchema),
});

export type ClubUser = z.infer<typeof ClubUserSchema>;

export type ClubDetail = z.infer<typeof ClubDetailSchema>;

export const ClubDetailResponseSchema = z.object({
	message: z.literal("success"),
	data: ClubDetailSchema,
});
export type ClubDetailResponse = z.infer<typeof ClubDetailResponseSchema>;
