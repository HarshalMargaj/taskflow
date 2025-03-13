"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteCard({
	id,
	boardId,
}: {
	id: string;
	boardId: string;
}) {
	const { orgId, userId } = await auth();
	if (!orgId || !userId) {
		throw new Error("Unauthorized");
	}
	await db.card.delete({
		where: {
			id,
			list: {
				board: {
					orgId,
				},
			},
		},
	});

	revalidatePath(`/board/${boardId}`);
	redirect(`/board/${boardId}`);
}
