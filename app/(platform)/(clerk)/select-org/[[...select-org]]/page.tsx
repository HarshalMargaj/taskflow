import { OrganizationList } from "@clerk/nextjs";

export default function SelectOrgPage() {
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
