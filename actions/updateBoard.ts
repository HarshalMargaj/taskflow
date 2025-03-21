"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

export type State = {
	errors?: {
		title?: string[];
	};
	message?: string | null;
};

const UpdateBoardSchema = z.object({
	id: z.string().min(1, { message: "Board ID is required" }),
	title: z
		.string()
		.min(3, { message: "Minimum length of 3 letters is required" }),
});

export async function update({ id, title }: { id: string; title: string }) {
	const { orgId } = await auth();
	const user = await currentUser();

	console.log(id, title);

	if (!user) {
		return { message: "Unauthorized" };
	}

	if (!orgId) {
		return { message: "No organization selected" };
	}

	const validatedFields = UpdateBoardSchema.safeParse({
		id,
		title,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing fields",
		};
	}

	try {
		const board = await db.boardsTable.update({
			where: { id, orgId },
			data: { title },
		});

		await createAuditLog({
			entityId: board.id,
			entityType: ENTITY_TYPE.BOARD,
			action: ACTION.UPDATE,
			entityTitle: board.title,
		});

		return {
			message: "Board updated successfully",
		};
	} catch (error) {
		console.error("Database error:", error);
		return {
			message: "Database error",
		};
	}
}
