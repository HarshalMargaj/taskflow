import { db } from "@/lib/db";

import { Skeleton } from "@/components/ui/skeleton";

import { ActivityItem } from "@/components/activity-item";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export const ActivityList = async () => {
	const { orgId } = await auth();

	if (!orgId) {
		redirect("/select-org");
	}

	const auditLogs = await db.auditLog.findMany({
		where: {
			orgId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	console.log(auditLogs);

	return (
		<div className="space-y-4 max-h-[calc(100vh-11rem)] overflow-y-auto scrollbar-hide">
			<p className="hidden last:block text-xs text-center text-muted-foreground">
				No activity found inside this organization
			</p>
			{auditLogs.map(item => (
				<ActivityItem key={item.id} data={item} />
			))}
		</div>
	);
};

ActivityList.Skeleton = function ActivityListSkeleton() {
	return (
		<ol className="space-y-4 mt-4">
			<Skeleton className="h-14 w-[80%]" />
			<Skeleton className="h-14 w-[50%]" />
			<Skeleton className="h-14 w-[70%]" />
			<Skeleton className="h-14 w-[80%]" />
			<Skeleton className="h-14 w-[75%]" />
		</ol>
	);
};
