import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

export default function Droppable({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div className={`${className}`} ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
