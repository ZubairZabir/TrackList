"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import { DeleteBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data;

  try {
    // Attempt to delete the board
    const board = await db.board.delete({
      where: {
        id,
        orgId,
      },
    });

    // Revalidate the path for the organization
    revalidatePath(`/organization/${orgId}`);

    // Redirect to the organization's page after deletion
    redirect(`/organization/${orgId}`);

    // This code will not run after redirect
    return {}; // Optionally return empty object or success message
  } catch (error) {
    // Handle the error if deletion fails
    return {
      error: "Failed to delete board",
    };
  }
};

// Export the deleteBoard action
export const deleteBoard = createSafeAction(DeleteBoard, handler);
