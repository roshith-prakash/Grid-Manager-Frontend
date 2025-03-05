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
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      className={`dark:border-white/25 rounded-lg ${className}`}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
}
