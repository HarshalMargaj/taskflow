"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { incrementAvailableCount, hasAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

export type State = {
	errors?: {
		title?: string[];
		image?: string[];
	};
	message?: string | null;
	boardId?: string;
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

export async function create(
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

	const canCreate = await hasAvailableCount();
	const isPro = await checkSubscription();

	if (!canCreate && !isPro) {
		return {
			message:
				"You have reached the maximum number of boards for this organization",
		};
	}

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

	const imageParts = image.split("|");

	if (imageParts.length !== 5) {
		return {
			errors: { image: ["Invalid image format."] },
			message: "Invalid image data",
		};
	}

	const [imageId, imageThumbUrl, imageFullUrl, imageLinkHtml, imageUserName] =
		imageParts;

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

		if (!isPro) {
			await incrementAvailableCount();
		}

		await createAuditLog({
			entityId: newBoard.id,
			entityType: ENTITY_TYPE.BOARD,
			action: ACTION.CREATE,
			entityTitle: newBoard.title,
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
