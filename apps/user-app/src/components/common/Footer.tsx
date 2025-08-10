"use client";

import React from "react";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
	return (
		<footer className="relative text-white ">
			{/* Footer Content */}
			<div className="bg-gray-900 text-gray-300 py-4">
				<div className="max-w-6xl mx-auto px-6 mt-4">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
						{/* Company Info */}
						<motion.div whileHover={{ scale: 1.02 }}>
							<h2 className="text-xl font-bold text-white mb-3">Biz-Network</h2>
							<p className="text-sm leading-relaxed">
								Connecting professionals and businesses for growth, powered by
								Biz-Network® B2B Network.
							</p>
						</motion.div>

						{/* Quick Links */}
						<motion.div whileHover={{ scale: 1.02 }}>
							<h3 className="text-lg font-semibold text-white mb-3">
								Quick Links
							</h3>
							<ul className="space-y-2">
								{[
									{ href: "/legal/privacy-policy", label: "Privacy Policy" },
									{ href: "/legal/refund-policy", label: "Refund Policy" },
									{
										href: "/legal/terms-and-conditions",
										label: "Terms & Conditions",
									},
									{
										href: "/legal/paymentTerms-and-conditions",
										label: "Payment Terms and Conditions",
									},
								].map(({ href, label }) => (
									<motion.li whileHover={{ x: 5 }} key={href}>
										<Link href={href} className="hover:text-red-500 transition">
											{label}
										</Link>
									</motion.li>
								))}
							</ul>
						</motion.div>

						{/* Social Links */}
						<motion.div whileHover={{ scale: 1.02 }}>
							<h3 className="text-lg font-semibold text-white mb-3">
								Follow Us
							</h3>
							<div className="flex justify-center md:justify-start space-x-4">
								{[
									{
										href: "https://facebook.com",
										icon: <FaFacebook />,
										color: "hover:text-blue-500",
									},
									{
										href: "https://twitter.com",
										icon: <FaTwitter />,
										color: "hover:text-blue-400",
									},
									{
										href: "https://instagram.com",
										icon: <FaInstagram />,
										color: "hover:text-pink-500",
									},
								].map(({ href, icon, color }) => (
									<motion.a
										whileHover={{ scale: 1.2, rotate: 5 }}
										whileTap={{ scale: 0.9 }}
										key={href}
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className={`text-xl text-gray-400 transition ${color}`}>
										{icon}
									</motion.a>
								))}
							</div>
						</motion.div>
					</motion.div>

					{/* Copyright */}
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 1 }}
						className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
						<p>
							<span className="text-white">&copy;</span>{" "}
							{new Date().getFullYear()}{" "}
							<span className="text-white">Biz-Network®</span>. All rights
							reserved.
						</p>
						<p className="mt-2">
							Developed by{" "}
							<Link
								href="https://www.hsdev.in/"
								target="_blank"
								className="text-red-500 hover:text-red-400 ">
								hsdev.in
							</Link>
						</p>
					</motion.div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
