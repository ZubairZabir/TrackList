"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import { DeleteList } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;

  let list;

  try {
    // Attempt to delete the board
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
    });

    // This code will not run after redirect
    return {}; // Optionally return empty object or success message
  } catch (error) {
    // Handle the error if deletion fails
    return {
      error: "Failed to delete list",
    };
  }
  // Revalidate the path for the organization
  revalidatePath(`/board/${boardId}`);

  return { data: list };
};

// Export the deleteBoard action
export const deleteList = createSafeAction(DeleteList, handler);
