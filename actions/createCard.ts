"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

export type State = {
	errors?: {
		title?: string[];
	};
	message?: string | null;
};

const CreateCardSchema = z.object({
	title: z
		.string()
		.min(3, { message: "Minimum length of 3 letters is required" }),
	boardId: z.string(),
	listId: z.string(),
});

export async function createCard(
	prevState: State,
	formData: FormData
): Promise<State> {
	const { orgId } = await auth(); // Gets the actively selected organization ID
	const user = await currentUser();

	if (!user) {
		return { message: "Unauthorized" };
	}

	if (!orgId) {
		return { message: "No organization selected" };
	}

	const validatedFields = CreateCardSchema.safeParse({
		title: formData.get("title"),
		boardId: formData.get("boardId"),
		listId: formData.get("listId"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing fields",
		};
	}

	const { title, boardId, listId } = validatedFields.data;

	try {
		// Ensure the list exists and belongs to the organization
		const list = await db.list.findUnique({
			where: {
				id: listId,
				board: {
					orgId,
				},
			},
		});

		if (!list) {
			return {
				message: "List not found",
			};
		}

		// Find the last card order to determine new order
		const lastCard = await db.card.findFirst({
			where: { listId },
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const newOrder = lastCard ? lastCard.order + 1 : 1;

		// Create the new card
		const card = await db.card.create({
			data: {
				title,
				listId,
				order: newOrder,
			},
		});

		// Create audit log
		await createAuditLog({
			entityId: card.id,
			entityType: ENTITY_TYPE.CARD,
			entityTitle: card.title,
			action: ACTION.CREATE,
		});

		// Revalidate cache
		revalidatePath(`/board/${boardId}`);

		return {
			message: "Card created successfully!",
		};
	} catch (error) {
		console.error("Database error:", error);
		return {
			message: "Database error occurred. Please try again.",
		};
	}
}
