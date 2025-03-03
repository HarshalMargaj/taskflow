"use clients";

import { forwardRef, KeyboardEventHandler } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";
import { useFormStatus } from "react-dom";

interface FormTextareaProps {
	id: string;
	label?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	errors?: Record<string, string[] | undefined>;
	className?: string;
	onBlur?: () => void;
	onClick?: () => void;
	onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
	defaultValue?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
	(
		{
			id,
			label,
			placeholder,
			required,
			disabled,
			errors,
			className,
			onBlur,
			onClick,
			onKeyDown,
			defaultValue,
		},
		ref
	) => {
		const { pending } = useFormStatus();

		return (
			<div className="space-y-2 w-full">
				<div className="space-y-1 w-full">
					{label ? (
						<label
							htmlFor="id"
							className="text-xs font-semibold text-neutral-700"
						>
							{label}
						</label>
					) : null}
				</div>
				<Textarea
					onKeyDown={onKeyDown}
					id={id}
					name={id}
					onBlur={onBlur}
					onClick={onClick}
					ref={ref}
					required={required}
					placeholder={placeholder}
					disabled={pending || disabled}
					className={cn(
						"resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:rign-0 outline-none shadow-sm bg-white",
						className
					)}
					aria-describedby={`${id}-error`}
					defaultValue={defaultValue}
				/>
				<FormErrors id={id} errors={errors} />
			</div>
		);
	}
);

FormTextarea.displayName = "FormTextarea";
