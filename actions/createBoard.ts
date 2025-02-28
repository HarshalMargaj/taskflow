"use server";

import { z } from "zod";

import { db } from "@/lib/db";

import { auth, currentUser } from "@clerk/nextjs/server";

export type State = {
	errors?: {
		title?: string[];
	};
	message?: string | null;
};

const CreateBoard = z.object({
	title: z.string().min(3, {
		message: "Minimum length of 3 letters is required",
	}),
	image: z.string({
		required_error: "Image is required",
		invalid_type_error: "Image is required",
	}),
});

export async function create(prevState: State, formData: FormData) {
	const { orgId } = await auth(); // Gets the actively selected organization ID
	const user = await currentUser();

	if (!user) {
		return { message: "Unauthorized" };
	}

	if (!orgId) {
		return { message: "No organization selected" };
	}

	// Now, `orgId` is the one the user has currently selected in Clerk
	console.log("Selected Organization ID:", orgId);

	const validatedFields = CreateBoard.safeParse({
		title: formData.get("title"),
		image: formData.get("image"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing fields",
		};
	}

	const { title, image } = validatedFields.data;
	console.log(image);

	const [imageId, imageThumbUrl, imageFullUrl, imageLinkHtml, imageUserName] =
		image.split("|");

	if (
		!imageId ||
		!imageThumbUrl ||
		!imageFullUrl ||
		!imageLinkHtml ||
		!imageUserName
	) {
		return {
			error: "Missing fields. Failed to create board",
		};
	}

	try {
		const newBoard = await db.boardsTable.create({
			data: {
				title,
				orgId,
				imageId,
				imageThumbUrl,
				imageFullUrl,
				imageLinkHtml,
				imageUserName,
			},
		});

		return {
			message: "Board created successfully",
			boardId: newBoard.id,
		};
	} catch (error) {
		console.error("Database error:", error);
		return {
			message: "Database error",
		};
	}
}
