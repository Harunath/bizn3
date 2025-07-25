import NextAuth, { NextAuthOptions } from "next-auth";
import { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import prisma, { UserMembershipType } from "@repo/db/client";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
	providers: [
		// Gmail Authentication
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Invalid email or password");
				}
				const user = await prisma.user.findFirst({
					where: { email: credentials.email },
					select: {
						id: true,
						email: true,
						password: true,
						firstname: true,
						lastname: true,
						registrationCompleted: true,
						homeClubId: true,
						businessDetails: {
							select: {
								id: true,
							},
						},
						membershipType: true,
					},
				});
				if (!user) {
					throw new Error("Email does not exist");
				}
				const isValidPassword = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!isValidPassword) {
					throw new Error("Invalid password");
				}
				return {
					id: user.id,
					email: user.email,
					firstname: user.firstname,
					lastname: user.lastname,
					membershipType: user.membershipType,
					businessId: user.businessDetails ? user.businessDetails.id : null,
					homeClub: user.homeClubId,
					registrationCompleted: true,
				};
			},
		}),
	],
	callbacks: {
		async signIn({ user }) {
			// Check if user already exists in the database
			if (!user) {
				return false;
			}
			const member = await prisma.user.findUnique({
				where: {
					email: user.email!,
				},
			});
			if (member) {
				return true;
			}

			return false;
		},
		async redirect({ baseUrl }) {
			return baseUrl + "/";
		},
		async jwt({ token, user, trigger }) {
			// Initial sign in
			if ((user && user.email) || (trigger === "update" && token?.email)) {
				const member = await prisma.user.findFirst({
					where: { email: token.email || user.email },
					select: {
						id: true,
						email: true,
						password: true,
						firstname: true,
						lastname: true,
						registrationCompleted: true,
						businessDetails: {
							select: {
								id: true,
							},
						},
						homeClubId: true,
						membershipType: true,
					},
				});

				if (member) {
					token.id = member.id;
					token.email = member.email;
					token.firstname = member.firstname;
					token.lastname = member.lastname;
					token.membershipType = member.membershipType;
					token.businessId = member.businessDetails?.id;
					token.registrationCompleted = member.registrationCompleted;
					token.homeClub = member.homeClubId;
				}
			}
			return token;
		},

		async session({ session, token }: { session: Session; token: JWT }) {
			if (session.user && token) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
				session.user.firstname = token.firstname as string;
				session.user.lastname = token.lastname as string;
				session.user.businessId = token.businessId as string;
				session.user.membershipType =
					token.membershipType as UserMembershipType;
				session.user.registrationCompleted =
					token.registrationCompleted as boolean;
				session.user.homeClub = token.homeClub as string | null;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET!,
};

export default NextAuth(authOptions);
