import { auth, currentUser } from "@clerk/nextjs/server";

import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";

interface Props {
	entityId: string;
	entityType: ENTITY_TYPE;
	action: ACTION;
	entityTitle: string;
}

export const createAuditLog = async (props: Props) => {
	try {
		const user = await currentUser();
		const { orgId } = await auth();

		if (!user || !orgId) {
			throw new Error("User or orgId not found");
		}

		const { entityId, entityType, action, entityTitle } = props;

		await db.auditLog.create({
			data: {
				orgId,
				entityId,
				entityType,
				entityTitle,
				action,
				userId: user.id,
				userImage: user.imageUrl,
				userName: user.firstName + " " + user.lastName,
			},
		});
	} catch (error) {
		console.log("[AUDIT_LOG_ERROR]", error);
	}
};
