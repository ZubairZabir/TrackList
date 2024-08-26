"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import { UpdateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, id } = data;

  try {
    const board = await db.board.update({
      where: {
        id,
        orgId,
      },
      data: {
        title,
      },
    });

    // Revalidate the path after the board has been successfully updated
    revalidatePath(`/board/${id}`);

    return {
      data: board,
    };
  } catch (error) {
    return {
      error: "Failed to update board",
    };
  }
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
