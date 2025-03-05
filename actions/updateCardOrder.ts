"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { z } from "zod";

const updateCardOrderSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			listId: z.string(),
			order: z.number(),
		})
	),
});

type UpdateListOrderInput = z.infer<typeof updateCardOrderSchema>;

export async function updateCardOrder(input: UpdateListOrderInput) {
	const { orgId } = await auth();

	if (!orgId) {
		return { message: "No organization selected" };
	}

	const validated = updateCardOrderSchema.safeParse(input);

	if (!validated.success) {
		return {
			error: "Invalid input data",
			details: validated.error.flatten(),
		};
	}

	const { items } = validated.data;
	console.log(items);
	let updatedCards;
	try {
		const transaction = items.map(card =>
			db.card.update({
				where: {
					id: card.id,
					list: {
						board: {
							orgId,
						},
					},
				},
				data: {
					order: card.order,
					listId: card.listId,
				},
			})
		);

		updatedCards = await db.$transaction(transaction);

		return { success: true };
	} catch (error) {
		console.error("Failed to update list order:", error);
		return {
			error: "Failed to update list order.",
		};
	}
}
