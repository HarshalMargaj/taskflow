"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

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

		await createAuditLog({
			entityId: card.id,
			entityType: ENTITY_TYPE.CARD,
			action: ACTION.UPDATE,
			entityTitle: card.title,
		});

		revalidatePath(`/board/${boardId}`);
	} catch (error) {
		console.error("Failed to update:", error);
		return {
			message: "Failed to update",
		};
	}
}
