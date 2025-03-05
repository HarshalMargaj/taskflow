"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { z } from "zod";

const updateListOrderSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			order: z.number(),
		})
	),
	boardId: z.string(),
});

type UpdateListOrderInput = z.infer<typeof updateListOrderSchema>;

export async function updateListOrder(input: UpdateListOrderInput) {
	const { orgId } = await auth();

	if (!orgId) {
		return { message: "No organization selected" };
	}

	const validated = updateListOrderSchema.safeParse(input);

	if (!validated.success) {
		return {
			error: "Invalid input data",
			details: validated.error.flatten(),
		};
	}

	const { items, boardId } = validated.data;
	console.log(items);
	let lists;
	try {
		const transaction = items.map(list =>
			db.list.update({
				where: {
					id: list.id,
					board: {
						orgId,
					},
				},
				data: {
					order: list.order,
				},
			})
		);

		lists = await db.$transaction(transaction);

		return { success: true };
	} catch (error) {
		console.error("Failed to update list order:", error);
		return {
			error: "Failed to update list order.",
		};
	}
}
