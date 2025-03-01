"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteBoard(id: string) {
	const { orgId } = await auth();

	await db.boardsTable.delete({
		where: {
			id,
		},
	});

	revalidatePath(`/organization/${orgId}`);
	redirect(`/organization/${orgId}`);
}
