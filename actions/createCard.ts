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

const CreateCard = z.object({
	title: z.string().min(3, {
		message: "Minimum length of 3 letters is required",
	}),
	boardId: z.string(),
	listId: z.string(),
});

export async function createCard(prevState: State, formData: FormData) {
	const { orgId } = await auth(); // Gets the actively selected organization ID
	const user = await currentUser();

	if (!user) {
		return { message: "Unauthorized" };
	}

	if (!orgId) {
		return { message: "No organization selected" };
	}

	const validatedFields = CreateCard.safeParse({
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

	let card;

	try {
		// here we check that the list is available or not
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
				error: "List not found",
			};
		}

		// here we are extracting the last order
		const lastCard = await db.card.findFirst({
			where: {
				listId,
			},
			orderBy: {
				order: "desc",
			},
			select: { order: true },
		});

		// here we are creating new order by adding 1 so if last order is 3 then we add 1 and it becomes 4

		const newOrder = lastCard ? lastCard.order + 1 : 1;

		// and here we are creating new card
		card = await db.card.create({
			data: {
				title,
				listId,
				order: newOrder,
			},
		});

		// here we are revlidating the path to refresh the page and update the changes
		revalidatePath(`/board/${boardId}`);
	} catch (error) {
		console.error("Database error:", error);
		return {
			message: "Database error",
		};
	}
}
