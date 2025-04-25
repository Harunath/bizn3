"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";
import dynamic from "next/dynamic";
interface linksType {
	name: string;
	href: string;
}
const ProfileOrSignin = dynamic(() => import("./ProfileOrSignin"), {
	ssr: false,
	loading: () => <LoadingSkeleton />,
});

export default function Navbar({ links }: { links: linksType[] }) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
			<div className="max-w-7xl mx-auto flex justify-between items-center px-2 py-3">
				<Link
					href="/"
					className="text-xl font-bold text-red-600 no-underline mr-2 flex items-center space-x-1">
					<Image
						src="https://res.cloudinary.com/dsq4uyqbb/image/upload/v1741682364/B_1_ftgxcr.png"
						alt="Biz-Network Logo"
						width={30}
						height={20}
						style={{ width: "auto", height: "auto" }}
					/>

					<span>
						Biz
						<span className="text-black inline-flex items-center">
							-Network<span className="text-sm align-top">®</span>
						</span>
					</span>
				</Link>

				<button
					className="md:hidden text-black"
					onClick={() => setMenuOpen(!menuOpen)}>
					{menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
				</button>

				<ul
					className={`md:flex md:space-x-6 font-small absolute md:static top-14 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-5 md:p-0 transition-all duration-300 ${
						menuOpen ? "block" : "hidden"
					}`}>
					{links.length > 0 &&
						links.map((link, index) => (
							<li key={index} className="py-2 md:py-0">
								<Link
									href={link.href}
									className="text-black hover:text-red-600 no-underline">
									{link.name}
								</Link>
							</li>
						))}
				</ul>
				<div className="hidden md:flex items-center space-x-4 px-3">
					<ProfileOrSignin />
				</div>
			</div>
		</nav>
	);
}

const LoadingSkeleton = () => (
	<div className="w-20 h-10 bg-red-600 animate-pulse rounded-full" />
);
