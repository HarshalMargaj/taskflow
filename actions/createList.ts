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

export async function createList(prevState: State, formData: FormData) {
	const { orgId } = await auth(); // Gets the actively selected organization ID
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

	let list;

	try {
		// find board
		const board = await db.boardsTable.findUnique({
			where: {
				id: boardId,
				orgId,
			},
		});

		// if not board

		if (!boardId) {
			return {
				error: "Board not found",
			};
		}

		const lastList = await db.list.findFirst({
			where: {
				boardId: boardId,
			},
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const newOrder = lastList ? lastList.order + 1 : 1;

		const list = await db.list.create({
			data: {
				title,
				boardId,
				order: newOrder,
			},
		});

		await createAuditLog({
			entityId: list.id,
			entityType: ENTITY_TYPE.LIST,
			action: ACTION.CREATE,
			entityTitle: list.title,
		});

		revalidatePath(`/board/${boardId}`);
	} catch (error) {
		console.error("Database error:", error);
		return {
			message: "Database error",
		};
	}
}
