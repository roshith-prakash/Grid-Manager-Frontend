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
      className="m-5 p-4 rounded border-2 bg-white"
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
