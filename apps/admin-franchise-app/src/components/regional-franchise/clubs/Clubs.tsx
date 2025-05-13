import { Club } from "@repo/db/client";

const Clubs = ({ clubs }: { clubs: Club[] }) => {
	return (
		<div>
			{clubs && clubs.length > 0 ? (
				<div className="grid lg:grid-cols-2 gap-4">
					{clubs.map((club) => (
						<div key={club.id}>
							<p>{club.name}</p>
							<p>{club.code}</p>
						</div>
					))}
				</div>
			) : (
				<div>No Clubs found.</div>
			)}
		</div>
	);
};
export default Clubs;
