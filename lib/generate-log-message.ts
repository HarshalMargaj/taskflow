import { ACTION, AuditLog } from "@prisma/client";

export const generateLogMessage = (log: AuditLog) => {
	const { action, entityType, entityTitle } = log;

	switch (action) {
		case ACTION.CREATE:
			return `Created ${entityType.toLowerCase()} "${entityTitle}"`;
		case ACTION.UPDATE:
			return `Updated ${entityType.toLowerCase()} "${entityTitle}"`;
		case ACTION.DELETE:
			return `Deleted ${entityType.toLowerCase()} "${entityTitle}"`;
		default:
			return `Performed ${action} on ${entityType.toLowerCase()} "${entityTitle}"`;
	}
};
