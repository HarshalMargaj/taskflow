"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteList(id: string, boardId: string) {
	const { orgId } = await auth();
	if (!orgId) {
		throw new Error("Unauthorized: No organization ID found.");
	}
	await db.list.delete({
		where: {
			id,
			boardId,
			board: {
				orgId,
			},
		},
	});

	revalidatePath(`/board/${boardId}`);
	redirect(`/board/${boardId}`);
}
