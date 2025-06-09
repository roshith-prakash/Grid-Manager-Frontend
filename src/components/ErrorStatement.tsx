import { useRef } from "react";

const ErrorStatement = ({
  text,
  isOpen,
  className,
}: {
  text: string;
  isOpen: boolean;
  className?: string;
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      ref={contentRef}
      className={`overflow-hidden text-justify text-sm py-1 px-1 text-error transition-[max-height] duration-300 ease-in-out ${
        isOpen ? "max-h-[99999px]" : "max-h-0"
      } ${className}`}
      style={{
        maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
      }}
    >
      {text}
    </div>
  );
};

export default ErrorStatement;
