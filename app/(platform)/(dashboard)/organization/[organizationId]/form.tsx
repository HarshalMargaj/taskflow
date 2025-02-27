"use client";

import { create } from "@/actions/createBoard";
import { useActionState } from "react";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";

export const Form = () => {
	const initialState = { message: null, errors: {} };
	const [state, dispatch] = useActionState(create, initialState);
	return (
		<form action={dispatch}>
			<FormInput id="title" errors={state?.errors} label="Board Title" />
			<FormSubmit variant="destructive" children="submit" />
		</form>
	);
};
