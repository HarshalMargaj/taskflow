"use client";

import { create } from "@/actions/createBoard";
import { useActionState } from "react";
import { FormInput } from "./form-input";
import { FormButton } from "./form-button";

export const Form = () => {
	const initialState = { message: null, errors: {} };
	const [state, dispatch] = useActionState(create, initialState);
	return (
		<form action={dispatch}>
			<FormInput errors={state?.errors} />
			<FormButton />
		</form>
	);
};
