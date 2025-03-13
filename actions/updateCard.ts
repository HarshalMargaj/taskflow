"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type State = {
	errors?: {
		title?: string[];
	};
	message?: string | null;
};

export async function updateCard({
	id,
	boardId,
	title,
	description,
}: {
	id: string;
	boardId: string;
	title: string;
	description: string;
}) {
	console.log("this is our formdata", { id, boardId, title, description });
	const { orgId, userId } = await auth();

	if (!userId || !orgId) {
		return { message: "Unauthorized" };
	}

	let card;

	try {
		card = await db.card.update({
			where: {
				id,
				list: {
					board: {
						orgId,
					},
				},
			},
			data: { title, description },
		});

		revalidatePath(`/board/${boardId}`);
	} catch (error) {
		console.error("Failed to update:", error);
		return {
			message: "Failed to update",
		};
	}
}
