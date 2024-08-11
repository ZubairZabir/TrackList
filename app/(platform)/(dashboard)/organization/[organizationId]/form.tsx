"use client";

import { createBoard } from "@/actions/create-dashbaord";
import { FormInput } from "./form-input";
import { FormButton } from "./form-button";
import { useAction } from "@/hooks/use-action";

export const Form = () => {
  const { execute, fieldErrors, isLoading } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log("Board created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating board:", error);
    },
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const title = formData.get("title") as string;

    execute({ title });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput errors={fieldErrors} />
      </div>
      <FormButton />
    </form>
  );
};
