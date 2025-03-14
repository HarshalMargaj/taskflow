"use server";

import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteList(id: string, boardId: string) {
	const { orgId } = await auth();
	if (!orgId) {
		throw new Error("Unauthorized: No organization ID found.");
	}
	const list = await db.list.delete({
		where: {
			id,
			boardId,
			board: {
				orgId,
			},
		},
	});

	await createAuditLog({
		entityId: list.id,
		entityType: ENTITY_TYPE.LIST,
		action: ACTION.DELETE,
		entityTitle: list.title,
	});

	revalidatePath(`/board/${boardId}`);
	redirect(`/board/${boardId}`);
}
