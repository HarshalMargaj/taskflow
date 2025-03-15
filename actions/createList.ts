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

const CreateList = z.object({
	title: z.string().min(3, {
		message: "Minimum length of 3 letters is required",
	}),
	boardId: z.string(),
});

export async function createList(
	prevState: State,
	formData: FormData
): Promise<State> {
	const { orgId } = await auth();
	const user = await currentUser();

	if (!user) {
		return { message: "Unauthorized" };
	}

	if (!orgId) {
		return { message: "No organization selected" };
	}

	const validatedFields = CreateList.safeParse({
		title: formData.get("title"),
		boardId: formData.get("boardId"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing fields",
		};
	}

	const { title, boardId } = validatedFields.data;

	try {
		// Find board
		const board = await db.boardsTable.findUnique({
			where: { id: boardId, orgId },
		});

		// If board is not found
		if (!board) {
			return { message: "Board not found" };
		}

		const lastList = await db.list.findFirst({
			where: { boardId },
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const newOrder = lastList ? lastList.order + 1 : 1;

		const list = await db.list.create({
			data: { title, boardId, order: newOrder },
		});

		await createAuditLog({
			entityId: list.id,
			entityType: ENTITY_TYPE.LIST,
			action: ACTION.CREATE,
			entityTitle: list.title,
		});

		revalidatePath(`/board/${boardId}`);

		// Return success message
		return { message: "List created successfully" };
	} catch (error) {
		console.error("Database error:", error);
		return { message: "Database error" };
	}
}
