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
      className="m-5 flex flex-wrap gap-5 justify-center p-10 rounded border-2 shadow-md "
      ref={setNodeRef}
      style={style}
    >
      {children}
    </div>
  );
}
