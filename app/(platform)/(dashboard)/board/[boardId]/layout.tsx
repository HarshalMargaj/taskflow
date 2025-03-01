import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";

export async function generateMetadata({
	params,
}: {
	params: { boardId: string };
}) {
	const { orgId } = await auth();
	if (!orgId) {
		return { title: "Board" };
	}

	const board = await db.boardsTable.findUnique({
		where: {
			id: params.boardId,
			orgId,
		},
	});

	return {
		title: board?.title || "board",
	};
}

const BoardIdLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { boardId: string };
}) => {
	const { orgId } = await auth();

	if (!orgId) {
		return redirect("/select-org");
	}

	const board = await db.boardsTable.findUnique({
		where: {
			id: params.boardId,
			orgId,
		},
	});

	if (!board) {
		return notFound();
	}

	return (
		<div
			style={{ backgroundImage: `url(${board.imageFullUrl})` }}
			className="h-full bg-cover relative w-full"
		>
			<BoardNavbar data={board} />
			<div className="absolute inset-0 bg-black/10" />
			<main className="relative h-full pt-28">{children}</main>
		</div>
	);
};

export default BoardIdLayout;
