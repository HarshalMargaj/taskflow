"use server";

import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { decrementAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteBoard(id: string) {
	const { orgId } = await auth();
	const isPro = await checkSubscription();

	const board = await db.boardsTable.delete({
		where: {
			id,
		},
	});

	if (!isPro) {
		await decrementAvailableCount();
	}

	await createAuditLog({
		entityId: board.id,
		entityType: ENTITY_TYPE.BOARD,
		action: ACTION.DELETE,
		entityTitle: board.title,
	});

	revalidatePath(`/organization/${orgId}`);
	redirect(`/organization/${orgId}`);
}
