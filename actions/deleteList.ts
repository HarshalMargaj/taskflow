"use server";

import { db } from "@/lib/db";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteList(id: string, boardId: string) {
	await db.list.delete({
		where: {
			id,
			boardId,
		},
	});

	revalidatePath(`/board/${boardId}`);
	redirect(`/board/${boardId}`);
}
