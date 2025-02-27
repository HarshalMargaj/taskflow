"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
});

export async function create(prevState: State, formData: FormData) {
	const validatedFields = CreateBoard.safeParse({
		title: formData.get("title"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing fields",
		};
	}

	const { title } = validatedFields.data;

	console.log({ title });

	try {
		const newBoard = await db.boardsTable.create({
			data: {
				title,
			},
		});
	} catch (error) {
		console.error("Database error:", error);
		return {
			message: "Database error",
		};
	}

	revalidatePath(
		"/organization/org_2tNp4y7LoIFApRLNpdqgtLZN2TK?title=sdfsdf"
	);
	redirect("/organization/org_2tNp4y7LoIFApRLNpdqgtLZN2TK?title=sdfsdf");
}
