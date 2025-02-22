import { OrganizationList } from "@clerk/nextjs";

export default function () {
	return (
		<div>
			<OrganizationList
				afterCreateOrganizationUrl="/organization/:id"
				afterSelectOrganizationUrl="/organization/:id"
				hidePersonal
			/>
		</div>
	);
}
