import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
	req: Request,
	context: { params: Promise<{ cardId: string }> } // ✅ params is a Promise
) {
	try {
		const resolvedParams = await context.params; // ✅ Await params before using

		const { cardId } = resolvedParams; // Now safe to destructure

		const { orgId, userId } = await auth();

		if (!orgId || !userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const card = await db.card.findUnique({
			where: {
				id: cardId,
				list: {
					board: {
						orgId,
					},
				},
			},
			include: {
				list: {
					select: {
						title: true,
					},
				},
			},
		});

		if (!card) {
			return new NextResponse("Card not found", { status: 404 });
		}

		return NextResponse.json(card);
	} catch (error) {
		console.error("Error fetching card:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
