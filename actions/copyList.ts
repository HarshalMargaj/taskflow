"use server";

import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const copyListSchema = z.object({
	id: z.string(),
	boardId: z.string(),
});

export async function copyList(formData: FormData) {
	const { orgId } = await auth();
	if (!orgId) {
		throw new Error("Unauthorized: No organization ID found.");
	}

	const validatedFields = copyListSchema.safeParse({
		id: formData.get("id"),
		boardId: formData.get("boardId"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing fields",
		};
	}

	const { id, boardId } = validatedFields.data;
	let list;
	try {
		const listToCopy = await db.list.findUnique({
			where: {
				id,
				boardId,
				board: {
					orgId,
				},
			},
			include: {
				cards: true,
			},
		});

		if (!listToCopy) {
			return { error: "List not found" };
		}

		const lastList = await db.list.findFirst({
			where: { boardId },
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const newOrder = lastList ? lastList.order + 1 : 1;
		list = await db.list.create({
			data: {
				boardId: listToCopy.boardId,
				title: `${listToCopy.title} copy`,
				order: newOrder,
				cards: {
					createMany: {
						data: listToCopy.cards.map(card => ({
							title: card.title,
							description: card.description,
							order: card.order,
						})),
					},
				},
			},
			include: {
				cards: true,
			},
		});

		await createAuditLog({
			entityId: list.id,
			entityType: ENTITY_TYPE.LIST,
			action: ACTION.CREATE,
			entityTitle: list.title,
		});
	} catch (error) {
		console.log("Failed to Copy");
	}

	revalidatePath(`/board/${boardId}`);
	redirect(`/board/${boardId}`);
}
