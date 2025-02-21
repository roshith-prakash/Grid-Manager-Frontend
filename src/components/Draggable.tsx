import { useDraggable } from "@dnd-kit/core";
import { ReactNode } from "react";

export default function Draggable({
  id,
  value,
  children,
}: {
  id: string;
  value?: string;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button
      className="bg-white dark:bg-darkbg p-4 rounded-xs border-1"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      value={value}
    >
      {children}
    </button>
  );
}
