import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ENTITY_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	context: { params: Promise<{ cardId: string }> }
) {
	try {
		const resolvedParams = await context.params;
		const { cardId } = resolvedParams;
		const { orgId, userId } = await auth();
		if (!orgId || !userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const auditLogs = await db.auditLog.findMany({
			where: {
				orgId,
				entityId: cardId,
				entityType: ENTITY_TYPE.CARD,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 3,
		});

		return NextResponse.json(auditLogs);
	} catch (error) {
		console.error(error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
