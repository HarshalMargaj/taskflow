import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
	params: Promise<{
		boardId: string;
	}>;
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
	const { boardId } = await params;
	const { orgId } = await auth();
	if (!orgId) {
		return redirect("/select-org");
	}

	const lists = await db.list.findMany({
		where: {
			boardId: boardId,
			board: {
				orgId,
			},
		},
		include: {
			cards: {
				orderBy: {
					order: "asc",
				},
			},
		},
		orderBy: {
			order: "asc",
		},
	});

	return (
		<div className="p-4 h-full overflow-x-auto">
			<ListContainer boardId={boardId} data={lists} />
		</div>
	);
};

export default BoardIdPage;
