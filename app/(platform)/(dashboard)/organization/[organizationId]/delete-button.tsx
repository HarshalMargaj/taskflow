"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export const DeleteButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button
			type="submit"
			variant="destructive"
			className="bg-red-500 text-white font-bold rounded-md"
			disabled={pending}
		>
			Delete
		</Button>
	);
};
