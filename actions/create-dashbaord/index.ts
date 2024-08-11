"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title } = data;

  try {
    const board = await db.board.create({
      data: {
        title,
      },
    });

    revalidatePath(`/board/${board.id}`);
    return { data: board };
  } catch (error) {
    console.error("Error creating board:", error); // Log the error for debugging
    return {
      error: "Failed to create board",
    };
  }
};

export const createBoard = createSafeAction(CreateBoard, handler);
