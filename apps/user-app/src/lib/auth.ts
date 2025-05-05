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
				};
			},
		}),
	],
	callbacks: {
		async signIn({ user }) {
			// Check if user already exists in the database
			const member = await prisma.user.findUnique({
				where: {
					email: user.email!,
				},
			});

			// If user doesn't exist, create a new record
			if (member) {
				return true;
			}
			return false;
		},
		async redirect({ baseUrl }) {
			return baseUrl + "/login";
		},
		async jwt({ token, user }) {
			if (user && user.email) {
				const member = await prisma.user.findFirst({
					where: { email: user.email },
					select: {
						id: true,
						email: true,
						password: true,
						firstname: true,
						lastname: true,
						businessDetails: {
							select: {
								id: true,
							},
						},
						membershipType: true,
					},
				});
				if (member) {
					token.id = member?.id;
					token.email = member?.email;
					token.firstname = member?.firstname;
					token.lastname = member?.lastname;
					token.membershipType = member?.membershipType;
					token.businessId = member?.businessDetails?.id;
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
