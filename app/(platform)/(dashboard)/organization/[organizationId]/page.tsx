"use client";
import { BoardList } from "./_components/board-list";
import { Info } from "./_components/info";
import { Separator } from "@/components/ui/separator";

const OrganizationPage = () => {
	return (
		<div className="w-full mb-20">
			<Info />
			<Separator className="my-4" />
			<div className="px-2 md:px-4">
				<BoardList />
			</div>
		</div>
	);
};

export default OrganizationPage;
