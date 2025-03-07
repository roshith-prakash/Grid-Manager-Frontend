import { useDraggable } from "@dnd-kit/core";
import { ReactNode } from "react";

export default function Draggable({
  id,
  value,
  children,
  className,
}: {
  id: string;
  value?: string;
  children: ReactNode;
  className?: string;
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
      className={`${className} min-w-30 cursor-grab`}
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
