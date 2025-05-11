// components/HomeClub.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Country, Zone, Region, Chapter, Club } from "@repo/db/client";

interface chaptersAndClubsType extends Chapter {
	clubs: Club[];
}

const colors = {
	red: "text-red-500",
	blue: "text-blue-500",
	green: "text-green-500",
	black: "text-black",
	white: "text-white bg-black",
};

const fetchData = async (type: string, id?: string) => {
	try {
		const uri = id ? `api/${type}?id=${id}` : `api/${type}`;
		const response = await fetch(uri);
		const data = await response.json();
		if (data.message == "success") {
			return data.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
};

const fetchChapters = async (id: string) => {
	try {
		const uri = `api/locations/regions/clubs/${id}`;
		const response = await fetch(uri);
		const data = await response.json();
		if (data.message == "success") {
			return data.data;
		}
	} catch (error) {
		console.error(error);
		return [];
	}
};

const HomeClub = () => {
	const [countries, setCountries] = useState<Country[]>([]);
	const [zones, setZones] = useState<Zone[]>([]);
	const [regions, setRegions] = useState<Region[]>([]);
	const [chapters, setChapters] = useState<chaptersAndClubsType[]>([]);

	const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
	const [selectedZone, setSelectedZone] = useState<string | null>(null);
	const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
	const [selectedChapter, setSelectedChapter] = useState<number | null>();
	const [selectedClub, setSelectedClub] = useState<string | null>(null);

	const router = useRouter();

	useEffect(() => {
		fetchData("locations/countries").then(setCountries);
	}, []);

	useEffect(() => {
		if (selectedCountry) {
			fetchData("locations/zones", selectedCountry).then(setZones);
		}
	}, [selectedCountry]);

	useEffect(() => {
		if (selectedZone) {
			fetchData("locations/regions", selectedZone).then(setRegions);
		}
	}, [selectedZone]);

	useEffect(() => {
		if (selectedRegion) {
			setChapters([]);
			setSelectedChapter(null);
			fetchChapters(selectedRegion).then(setChapters);
		}
	}, [selectedRegion]);

	const handleJoin = async () => {
		if (selectedClub) {
			const res = await fetch("/api/user/clubs/homeclub", {
				method: "POST",
				body: JSON.stringify({ homeClubId: selectedClub }),
			});
			const result = await res.json();
			if (result.message == "success") {
				toast.success("successfully joined the club");
				const res = await fetch("/api/auth/register/registrationCompleted", {
					method: "POST",
				});
				const result = await res.json();
				if (result.message == "success") {
					toast.success("Registration completed successfully");
				}
				router.push("/");
			}
		}
	};
	console.log(selectedChapter);
	return (
		<motion.div
			className="p-6 bg-white rounded-xl shadow-xl max-w-md mx-auto mt-10 space-y-4"
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}>
			<h2 className="text-2xl font-bold text-black">Join a Club</h2>

			<SelectBox
				label="Country"
				options={countries}
				value={selectedCountry}
				onChange={setSelectedCountry}
				color={colors.red}
			/>
			<SelectBox
				label="Zone"
				options={zones}
				value={selectedZone}
				onChange={setSelectedZone}
				color={colors.blue}
			/>
			<SelectBox
				label="Region"
				options={regions}
				value={selectedRegion}
				onChange={setSelectedRegion}
				color={colors.green}
			/>
			<motion.div
				initial={{ opacity: 0, x: -10 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.3 }}>
				<label className={`block mb-1 font-medium`}>Chapter</label>
				<select
					className={`w-full border border-gray-300 rounded px-3 py-2 ${
						selectedRegion ? "" : "bg-gray-300 text-gray-500 cursor-not-allowed"
					}`}
					disabled={selectedRegion ? false : true}
					value={selectedChapter || ""}
					onChange={(e) => {
						console.log(e.target.value);
						setSelectedChapter(Number(e.target.value));
					}}>
					<option value="">Select Chapter</option>
					{chapters.map((opt, index) => (
						<option key={opt?.id} value={index}>
							{opt.name}
						</option>
					))}
				</select>
			</motion.div>
			{selectedChapter !== null &&
			chapters &&
			selectedChapter &&
			chapters[selectedChapter]?.clubs ? (
				<SelectBox
					label="Club"
					options={chapters[selectedChapter].clubs}
					value={selectedClub}
					onChange={setSelectedClub}
					color={colors.black}
				/>
			) : (
				<SelectBox
					label="Club"
					options={[]}
					value={null}
					onChange={setSelectedClub}
					color={colors.black}
				/>
			)}

			<motion.button
				className={`w-full py-2 px-4 rounded font-semibold ${
					selectedClub
						? colors.white
						: "bg-gray-300 text-gray-500 cursor-not-allowed"
				}`}
				whileTap={{ scale: 0.95 }}
				onClick={handleJoin}
				disabled={selectedClub ? false : true}>
				Join
			</motion.button>
		</motion.div>
	);
};

type BaseOption = {
	id: string;
	name: string;
};

type SelectBoxProps<T extends BaseOption> = {
	label: string;
	options: T[];
	value: string | null;
	onChange: (val: string) => void;
	color: string;
};

const SelectBox = <T extends BaseOption>({
	label,
	options,
	value,
	onChange,
	color,
}: SelectBoxProps<T>) => (
	<motion.div
		initial={{ opacity: 0, x: -10 }}
		animate={{ opacity: 1, x: 0 }}
		transition={{ duration: 0.3 }}>
		<label className={`block mb-1 font-medium ${color}`}>{label}</label>
		<select
			className={`w-full border border-gray-300 rounded px-3 py-2 ${
				options.length > 0 ? "" : "bg-gray-300 text-gray-500 cursor-not-allowed"
			}`}
			disabled={options.length === 0}
			value={value ?? ""}
			onChange={(e) => onChange(e.target.value)}>
			<option value="">Select {label}</option>
			{options.map((opt) => (
				<option key={opt.id} value={opt.id}>
					{opt.name}
				</option>
			))}
		</select>
	</motion.div>
);

export default HomeClub;
