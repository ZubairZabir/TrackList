"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const CreateBoard = z.object({
  title: z.string(),
});

export async function create(formData: FormData) {
  const { title } = CreateBoard.parse({
    title: formData.get("title"),
  });

  await db.board.create({
    data: {
      title,
    },
  });

  revalidatePath(
    "/organization/org_2jvqQyX9iqmaVlpbhnDod8NMYUB"
  );
}
