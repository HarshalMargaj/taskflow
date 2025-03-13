"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type State = {
	errors?: {
		title?: string[];
	};
	message?: string | null;
};

const UpdateCardSchema = z.object({
	boardId: z.string(),
	description: z.optional(
		z
			.string({
				required_error: "Description is required",
				invalid_type_error: "Description is required",
			})
			.min(3, {
				message: "Description is too short",
			})
	),
	id: z.string().min(1, { message: "Board ID is required" }),
	title: z
		.string({
			required_error: "Title is required",
			invalid_type_error: "Title is required",
		})
		.min(3, { message: "Minimum length of 3 letters is required" }),
});

export async function updateCard({
	id,
	boardId,
	title,
}: {
	id: string;
	boardId: string;
	title: string;
}) {
	console.log("this is our formdata", { id, boardId, title });
	const { orgId, userId } = await auth();

	if (!userId || !orgId) {
		return { message: "Unauthorized" };
	}

	// const validatedFields = UpdateCardSchema.safeParse({
	// 	title: formData.get("title"),
	// 	id: formData.get("id"),
	// 	boardId: formData.get("boardId"),
	// });

	// console.log("checking", validatedFields);

	// if (!validatedFields.success) {
	// 	return {
	// 		errors: validatedFields.error.flatten().fieldErrors,
	// 		message: "Missing fields",
	// 	};
	// }

	// console.log("checking 2", validatedFields);

	// const { id, boardId, ...values } = validatedFields.data;
	// console.log(id, boardId);
	let card;

	try {
		card = await db.card.update({
			where: {
				id,
				list: {
					board: {
						orgId,
					},
				},
			},
			data: { title },
		});

		revalidatePath(`/board/${boardId}`);
	} catch (error) {
		console.error("Failed to update:", error);
		return {
			message: "Failed to update",
		};
	}
}
