"use server";

import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
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
	const card = await db.card.delete({
		where: {
			id,
			list: {
				board: {
					orgId,
				},
			},
		},
	});

	await createAuditLog({
		entityId: card.id,
		entityType: ENTITY_TYPE.CARD,
		action: ACTION.DELETE,
		entityTitle: card.title,
	});

	revalidatePath(`/board/${boardId}`);
	redirect(`/board/${boardId}`);
}
