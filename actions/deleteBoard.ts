"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteBoard(id: string) {
	await db.boardsTable.delete({
		where: {
			id,
		},
	});

	revalidatePath("/organization/org_2tNp4y7LoIFApRLNpdqgtLZN2TK");
}
