"use server";

import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function copyCard({
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

	let card;
	try {
		const cardToCopy = await db.card.findUnique({
			where: {
				id,
				list: {
					board: {
						orgId,
					},
				},
			},
		});

		if (!cardToCopy) {
			return { error: "Card not found" };
		}

		const lastCard = await db.card.findFirst({
			where: { listId: cardToCopy.listId },
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const newOrder = lastCard ? lastCard.order + 1 : 1;
		card = await db.card.create({
			data: {
				title: `${cardToCopy.title} copy`,
				order: newOrder,
				description: cardToCopy.description,
				listId: cardToCopy.listId,
			},
		});

		await createAuditLog({
			entityId: card.id,
			entityType: ENTITY_TYPE.CARD,
			action: ACTION.CREATE,
			entityTitle: card.title,
		});
	} catch (error) {
		console.log("Failed to Copy");
	}

	revalidatePath(`/board/${boardId}`);
}
