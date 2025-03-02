"use client";

import { List } from "@prisma/client";

interface ListHeaderProps {
	data: List;
}

export const ListHeader = ({ data }: ListHeaderProps) => {
	return (
		<div className="flex items-start justify-between pt-2 px-2 font-semibold gap-x-2 text-sm">
			<div className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
				{data.title}
			</div>
		</div>
	);
};
