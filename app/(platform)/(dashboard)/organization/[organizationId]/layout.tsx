import { OrgControl } from "./_components/orgControl";
import { startCase } from "lodash";
import { auth } from "@clerk/nextjs/server";

export async function generateMetadata() {
	const { orgSlug } = await auth();
	return {
		title: startCase(orgSlug || "organization"),
	};
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-full">
			<OrgControl />
			{children}
		</div>
	);
};

export default OrganizationIdLayout;
