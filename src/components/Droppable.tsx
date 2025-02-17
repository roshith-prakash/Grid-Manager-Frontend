import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

export default function Droppable({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div
      className="bg-white m-5 p-10 rounded border-2 shadow-md flex flex-wrap justify-center"
      ref={setNodeRef}
      style={style}
    >
      {children}
    </div>
  );
}
