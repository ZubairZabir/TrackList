import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  try {
    const lists = await db.list.findMany({
      where: {
        boardId: params.boardId,
        board: {
          orgId, // This field matches the schema definition
        },
      },
      include: {
        cards: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return (
      <div className="p-4 h-full overflow-x-auto">
        <ListContainer boardId={params.boardId} data={lists} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching lists:", error);
    // You can handle redirection or error display here
    redirect("/error-page"); // Replace with your actual error page
  }
};

export default BoardIdPage;
