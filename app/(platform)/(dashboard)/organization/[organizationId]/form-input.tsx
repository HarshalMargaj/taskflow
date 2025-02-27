import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";

interface FormInputProps {
	errors: {
		title?: string[];
	};
}

export const FormInput = ({ errors }: FormInputProps) => {
	const { pending } = useFormStatus();
	return (
		<>
			<div>
				<Input
					type="text"
					placeholder="Enter you text here"
					name="title"
					required
					disabled={pending}
				/>
			</div>
			<div>
				{errors?.title ? (
					<div>
						{errors.title.map(error => (
							<p key={error} className="text-rose-500">
								{error}
							</p>
						))}
					</div>
				) : null}
			</div>
		</>
	);
};
