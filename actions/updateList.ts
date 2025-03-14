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

const UpdateListSchema = z.object({
	id: z.string(),
	boardId: z.string(),
	title: z
		.string()
		.min(3, { message: "Minimum length of 3 letters is required" }),
});

export async function updateList(formData: FormData) {
	const { orgId } = await auth();
	const user = await currentUser();

	if (!user) {
		return { message: "Unauthorized" };
	}

	if (!orgId) {
		return { message: "No organization selected" };
	}

	const validatedFields = UpdateListSchema.safeParse({
		id: formData.get("id"),
		boardId: formData.get("boardId"),
		title: formData.get("title"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing fields",
		};
	}

	const { id, boardId, title } = validatedFields.data;
	console.log(id, boardId, title);
	let list;
	try {
		list = await db.list.update({
			where: {
				id,
				boardId,
				board: {
					orgId,
				},
			},
			data: {
				title,
			},
		});

		await createAuditLog({
			entityId: list.id,
			entityType: ENTITY_TYPE.LIST,
			action: ACTION.UPDATE,
			entityTitle: list.title,
		});

		revalidatePath(`/board/${boardId}`);
		return { message: `${title}` };
	} catch (error) {
		console.error("Database error:", error);
		return {
			message: "Database error",
		};
	}
}
