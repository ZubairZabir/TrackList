
import { db } from "@/lib/db";
import { Board } from "./board";
import { Form } from "./form";

interface Board {
  id: string;
  title: string;
}

const OrganizationIdPage = async () => {
  let boards: Board[] = [];

  try {
    boards = await db.board.findMany();
  } catch (error) {
    console.error("Error fetching boards:", error);
  }

  return (
    <div className="flex flex-col space-y-4">
      <Form />
      <div className="space-y-2">
        {" "}
        {boards.length > 0 ? (
          boards.map((board) => (
            <Board key={board.id} id={board.id} title={board.title} />
          ))
        ) : (
          <p>No boards available</p>
        )}
      </div>
    </div>
  );
};

export default OrganizationIdPage;
