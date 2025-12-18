"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";

import { loginAction } from "../_actions/login.action";
import { type LoginInput, loginSchema } from "../_schemas/login.schema";

type UseLoginFormResult = {
	form: UseFormReturn<LoginInput>;
	onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
	serverMessage: string;
	isSuccess: boolean;
};

export function useLoginForm(): UseLoginFormResult {
	const [serverMessage, setServerMessage] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);
	const router = useRouter();

	const form = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = form.handleSubmit(async (values) => {
		setServerMessage("");
		setIsSuccess(false);

		const result = await loginAction(values);

		if (result.success) {
			setIsSuccess(true);
			setServerMessage(result.message);
			router.push("/");
			router.refresh();
		} else {
			setServerMessage(result.message);
			if (result.errors) {
				Object.entries(result.errors).forEach(([field, messages]) => {
					form.setError(field as keyof LoginInput, {
						type: "server",
						message: messages[0],
					});
				});
			}
		}
	});

	return {
		form,
		onSubmit,
		serverMessage,
		isSuccess,
	};
}
